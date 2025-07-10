package auth

import (
	"context"
	"database/sql"
	"errors"

	"github.com/go-webauthn/webauthn/webauthn"
	"github.com/google/uuid"
	"github.com/keinbudget/backend/internal/db" // Assumed path to your db package
)

// AuthUser implements the webauthn.User interface.
// It wraps the database user model and adds credential data.
type AuthUser struct {
	db.User
	Credentials []db.Credential // We'll need a db.Credential model from sqlc
}

// WebAuthnID returns the user's ID as a byte slice (required by the interface).
func (u AuthUser) WebAuthnID() []byte {
	return []byte(u.ID.String())
}

// WebAuthnName returns the user's username.
func (u AuthUser) WebAuthnName() string {
	return u.Username
}

// WebAuthnDisplayName returns the user's display name.
func (u AuthUser) WebAuthnDisplayName() string {
	return u.Username
}

// WebAuthnCredentials returns the user's credentials.
func (u AuthUser) WebAuthnCredentials() []webauthn.Credential {
	creds := make([]webauthn.Credential, len(u.Credentials))
	for i, c := range u.Credentials {
		creds[i] = webauthn.Credential{
			ID:          []byte(c.ID), // c.ID is the base64url encoded string
			PublicKey:   c.PublicKey,
		}
	}
	return creds
}

func GetWebAuthnUser(ctx context.Context, DB *db.Queries, userID uuid.UUID) (*AuthUser, error) {
	dbUser, err := DB.GetUserByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	dbCredentials, err := DB.GetCredentialsByUserID(ctx, userID)
	if err != nil && !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	return &AuthUser{
		User:        dbUser,
		Credentials: dbCredentials,
	}, nil
}