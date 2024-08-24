package handlers

import (
	"net/http"
	"time"

	"github.com/cheetahybte/keinbudget-backend/middleware"
	"github.com/cheetahybte/keinbudget-backend/pkg/auth"
	. "github.com/cheetahybte/keinbudget-backend/pkg/utils"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type UserHandler struct {
	DB *sqlx.DB
}

func (handler *UserHandler) HandleAddUser(w http.ResponseWriter, r *http.Request) {
	var userData types.UserDataDTO

	err := ParseJSON(r, &userData)
	if err != nil {
		problem := NewProblemDetails(
			WithStatus(http.StatusBadRequest),
			WithDetail(err.Error()),
			WithTitle("Parsing error"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/parsing-error"),
		)
		WriteError(w, &problem)
		return
	}

	hashedPassword, err := auth.HashPassword(userData.Password)
	if err != nil {
		problem := NewProblemDetails(
			WithStatus(http.StatusInternalServerError),
			WithDetail("error during password encryption"),
			WithTitle("something went wrong during the encryption of the password."),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/password-encryption-error"),
		)
		WriteError(w, &problem)
		return
	}

	user := types.User{
		ID:       uuid.New(),
		Username: userData.Username,
		Email:    userData.Email,
		Password: hashedPassword,
	}

	_, err = handler.DB.NamedExec("insert into users (id, email, username, password) values(:id, :email, :username, :password);", &user)
	if err != nil {
		problem := NewProblemDetails(
			WithStatus(http.StatusInternalServerError),
			WithDetail(err.Error()),
			WithTitle("needs work"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/unknown"),
		)
		WriteError(w, &problem)
		return
	}
	WriteJSON(w, 201, types.Map{
		"message": "test",
	})
}

func (handler *UserHandler) HandleLoginUser(w http.ResponseWriter, r *http.Request) {
	var userLoginData types.UserLoginDTO

	err := ParseJSON(r, &userLoginData)
	if err != nil {
		problem := NewProblemDetails(
			WithStatus(http.StatusUnprocessableEntity),
			WithDetail(err.Error()),
			WithTitle("Parsing error"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/parsing-error-error"),
		)
		WriteError(w, &problem)
		return
	}

	var user types.User

	err = handler.DB.Get(&user, "select * from users where email = $1", userLoginData.Email)
	if err != nil {
		problem := NewProblemDetails(
			WithStatus(http.StatusNotFound),
			WithDetail(err.Error()),
			WithTitle("User not found"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/user-not-found-error"),
		)
		WriteError(w, &problem)
		return
	}

	if err := auth.CheckPasswords(userLoginData.Password, user.Password); err != nil {
		problem := NewProblemDetails(
			WithStatus(http.StatusUnauthorized),
			WithDetail(err.Error()),
			WithTitle("Invalid Password"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/invalid-password-error"),
		)
		WriteError(w, &problem)
		return
	}

	token, err := auth.MakeJWT(user)
	if err != nil {
		problem := NewProblemDetails(
			WithStatus(http.StatusInternalServerError),
			WithDetail(err.Error()),
			WithTitle("Error during Token Creation"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/token-error"),
		)
		WriteError(w, &problem)
		return
	}

	w.Header().Add("X-JWT", token)
	cookie := &http.Cookie{
		Name:     "auth",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24),
		Path:     "/",
		HttpOnly: true,
	}
	http.SetCookie(w, cookie)
	WriteJSON(w, 200, types.Map{"ok": 1})
}

func (handler *UserHandler) HandleGetOwnUser(w http.ResponseWriter, r *http.Request) {
	user, ok := r.Context().Value(middleware.UserTypeContextKeyString).(types.User)
	if !ok {
		problem := NewProblemDetails(
			WithStatus(http.StatusInternalServerError),
			WithDetail("The user provided by the auth middleware was malformed."),
			WithTitle("User was not found"),
			WithInstance(r.URL.Path),
			WithType("https://keinbudget.dev/errors/user-not-found-middleware"),
		)
		WriteError(w, &problem)
		return
	}

	WriteJSON(w, 200, user)
}
