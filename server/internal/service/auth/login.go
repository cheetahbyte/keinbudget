package auth

import (
	"encoding/json"

	"github.com/Unleash/unleash-client-go/v4"
	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func LoginStart(c *fiber.Ctx) error {
	if !unleash.IsEnabled("sign_in") {
		return fiber.NewError(fiber.StatusForbidden, "Dev login disabled by feature flag")
	}
	type request struct {
		Username string `json:"username"`
	}
	var body request
	if err := c.BodyParser(&body); err != nil || body.Username == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid username")
	}

	user, err := DB.GetUserByUsername(c.Context(), body.Username)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "User not found")
	}

	authUser, err := GetWebAuthnUser(c.Context(), DB, user.ID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to load user credentials")
	}

	options, sessionData, err := WebAuthn.BeginLogin(authUser)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to begin login")
	}

	sess, err := Store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Session error")
	}
	// Store as JSON []byte
	data, err := json.Marshal(sessionData)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Session marshal failed")
	}
	sess.Set("login_session", data)
	sess.Set("user_id", authUser.ID.String())
	if err := sess.Save(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to save session")
	}

	return c.JSON(options)
}

func LoginFinish(c *fiber.Ctx) error {
	if !unleash.IsEnabled("sign_in") {
		return fiber.NewError(fiber.StatusForbidden, "Dev login disabled by feature flag")
	}
	sess, err := Store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Session error")
	}

	userIDStr, ok := sess.Get("user_id").(string)
	if !ok {
		return fiber.NewError(fiber.StatusBadRequest, "Missing user_id")
	}
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid user_id")
	}

	authUser, err := GetWebAuthnUser(c.Context(), DB, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to load user")
	}

	// Get and decode login session data
	raw := sess.Get("login_session").([]byte)
	var sessionData webauthn.SessionData
	if err := json.Unmarshal(raw, &sessionData); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Failed to parse session data")
	}

	// Parse and verify
	response, err := protocol.ParseCredentialRequestResponseBody(c.Request().BodyStream())
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid response: "+err.Error())
	}

	_, err = WebAuthn.ValidateLogin(authUser, sessionData, response)
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid login: "+err.Error())
	}

	// Clean up session
	sess.Delete("login_session")
	sess.Set("authenticated", true) // Optional: you can set your login flag
	if err := sess.Save(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to save session")
	}

	return c.SendStatus(fiber.StatusOK)
}
