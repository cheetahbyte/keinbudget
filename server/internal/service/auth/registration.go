package auth

import (
	"bytes"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"

	"github.com/Unleash/unleash-client-go/v4"
	"github.com/go-webauthn/webauthn/protocol"
	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/keinbudget/backend/internal/db"
)

const sessionRegistration = "registration"

var DB *db.Queries

func BeginRegistration(c *fiber.Ctx) error {
	if !unleash.IsEnabled("sign_up") {
		return fiber.NewError(fiber.StatusForbidden, "Dev login disabled by feature flag")
	}
	type request struct {
		Username string `json:"username"`
	}
	var body request
	if err := c.BodyParser(&body); err != nil || body.Username == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid username")
	}

	_, err := DB.GetUserByUsername(c.Context(), body.Username)
	if err == nil {
		return fiber.NewError(fiber.StatusConflict, "Username is already taken")
	}
	if !errors.Is(err, sql.ErrNoRows) {
		log.Printf("Database error checking user: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Database error")
	}

	newUser, err := DB.CreateUser(c.Context(), db.CreateUserParams{
		ID:       uuid.New(),
		Username: body.Username,
	})
	if err != nil {
		log.Printf("Failed to create user: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to create user")
	}

	authUser := AuthUser{User: newUser, Credentials: []db.Credential{}}

	options, sessionData, err := WebAuthn.BeginRegistration(authUser)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to begin registration")
	}

	sess, err := Store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Session error")
	}
	data, _ := json.Marshal(sessionData)
	sess.Set(sessionRegistration, data)
	sess.Set("user_id", authUser.ID.String())
	if err := sess.Save(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to save session")
	}
	return c.JSON(options)
}

func FinishRegistration(c *fiber.Ctx) error {
	if !unleash.IsEnabled("sign_up") {
		return fiber.NewError(fiber.StatusForbidden, "Dev login disabled by feature flag")
	}
	sess, err := Store.Get(c)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Session error")
	}

	// Get user ID from session
	userIDStr, ok := sess.Get("user_id").(string)
	if !ok {
		return fiber.NewError(fiber.StatusBadRequest, "Missing user_id in session")
	}
	userID, err := uuid.Parse(userIDStr)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid user_id in session")
	}

	// Load the user and their (empty) credentials from the DB
	user, err := GetWebAuthnUser(c.Context(), DB, userID)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to load user")
	}

	// Get and decode session data
	raw, ok := sess.Get(sessionRegistration).([]byte)
	if !ok || raw == nil {
		return fiber.NewError(fiber.StatusBadRequest, "Missing or invalid registration session data")
	}

	var sessionData webauthn.SessionData
	if err := json.Unmarshal(raw, &sessionData); err != nil {
		log.Printf("Failed to unmarshal session data: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to decode session data")
	}

	body := c.Body()
	response, err := protocol.ParseCredentialCreationResponseBody(bytes.NewReader(body))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Failed to parse response: "+err.Error())
	}

	// Complete the ceremony
	credential, err := WebAuthn.CreateCredential(user, sessionData, response)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to create credential: "+err.Error())
	}

	// 💾 PERSIST: Save the new credential to the database
	err = DB.CreateCredential(c.Context(), db.CreateCredentialParams{
		ID:        base64.RawURLEncoding.EncodeToString(credential.ID),
		UserID:    user.ID,
		PublicKey: credential.PublicKey,
	})
	if err != nil {
		log.Printf("Failed to save credential to DB: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to save credential")
	}

	// Clean up the session
	sess.Delete(sessionRegistration)
	sess.Delete("user_id")
	if err := sess.Save(); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to save session")
	}

	return c.SendStatus(fiber.StatusOK)
}
