package auth_test

import (
	"testing"

	"github.com/cheetahbyte/keinbudget/backend/pkg/auth"
	"github.com/stretchr/testify/assert"
)

func TestGenerateJWTWithEmptySecret(t *testing.T) {
	_, err := auth.GenerateJWT("tester", []byte(""))
	if err == nil {
		t.Errorf("no error when empty secret is provided.")
	}
}

func TestGenerateJWTWithEmptyUsername(t *testing.T) {
	_, err := auth.GenerateJWT("", []byte("testSecret"))
	if err == nil {
		t.Errorf("no error when empty username is provided.")
	}
}

func TestGenerateJWTReturnsJWT(t *testing.T) {
	jwt, _ := auth.GenerateJWT("tester", []byte("test"))
	if !assert.NotEmpty(t, jwt) {
		t.Errorf("no jwt returned by function.")
	}
}

func TestValidateJWTNotAJWT(t *testing.T) {
	fakeJwt := "notajwt"
	_, err := auth.ValidateJWT(fakeJwt, []byte("secret"))
	assert.NotNil(t, err)
}
