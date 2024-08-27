package auth_test

import (
	"testing"

	"github.com/cheetahybte/keinbudget/pkg/auth"
	"golang.org/x/crypto/bcrypt"
)

func TestHashPassword(t *testing.T) {
	password := "testpassword"
	hashedPassword, err := auth.HashPassword(password)
	if err != nil {
		t.Errorf("HashPassword returned an error: %v", err)
	}

	if hashedPassword == "" {
		t.Error("Hashed password is empty")
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	if err != nil {
		t.Errorf("Hashed password does not match original password: %v", err)
	}
}

func TestCheckPasswordsMatch(t *testing.T) {
	password := "testpassword"
	hashedPassword, err := auth.HashPassword(password)
	if err != nil {
		t.Errorf("HashPassword returned an error: %v", err)
	}

	err = auth.CheckPasswords(password, hashedPassword)
	if err != nil {
		t.Errorf("CheckPasswords returned an error for matching passwords: %v", err)
	}
}

func TestCheckPasswordsDoNotMatch(t *testing.T) {
	password := "testpassword"
	hashedPassword, err := auth.HashPassword(password)
	if err != nil {
		t.Errorf("HashPassword returned an error: %v", err)
	}

	wrongPassword := "wrongpassword"
	err = auth.CheckPasswords(wrongPassword, hashedPassword)
	if err == nil {
		t.Error("CheckPasswords did not return an error for non-matching passwords")
	}
}
