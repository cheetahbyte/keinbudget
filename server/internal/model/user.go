package model

import (
	"github.com/go-webauthn/webauthn/webauthn"
)

type Credential struct {
	ID              []byte
	PublicKey       []byte
	AttestationType string
	AAGUID          []byte
	SignCount       uint32
}

type User struct {
	ID          []byte
	Username    string
	DisplayName string
	Credentials []Credential
}

// WebAuthn User Interface
func (u *User) WebAuthnID() []byte {
	return u.ID
}

func (u *User) WebAuthnName() string {
	return u.Username
}

func (u *User) WebAuthnDisplayName() string {
	return u.DisplayName
}

func (u *User) WebAuthnCredentials() []webauthn.Credential {
	creds := make([]webauthn.Credential, len(u.Credentials))
	for i, c := range u.Credentials {
		creds[i] = webauthn.Credential{
			ID:              c.ID,
			PublicKey:       c.PublicKey,
			AttestationType: c.AttestationType,
			Authenticator: webauthn.Authenticator{
				AAGUID:    c.AAGUID,
				SignCount: c.SignCount,
			},
		}
	}
	return creds
}

func (u *User) WebAuthnIcon() string {
	return "" // Optionales Icon
}
