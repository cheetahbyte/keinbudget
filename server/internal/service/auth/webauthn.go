package auth

import (
	"log"

	"github.com/go-webauthn/webauthn/webauthn"
)

var WebAuthn *webauthn.WebAuthn

func InitWebAuthn() {
	var err error
	WebAuthn, err = webauthn.New(&webauthn.Config{
		RPDisplayName: "Keinbudget",                      // Name deiner App
		RPID:          "localhost",                       // Domain deiner App
		RPOrigins:     []string{"http://localhost:4000"}, // Origin deiner App (Frontend)
	})
	if err != nil {
		log.Fatalf("⚠️ WebAuthn Init fehlgeschlagen: %v", err)
	}
}
