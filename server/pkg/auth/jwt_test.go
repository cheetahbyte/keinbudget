package auth_test

import (
	"testing"
	"time"

	"github.com/cheetahybte/keinbudget-backend/pkg/auth"
	"github.com/cheetahybte/keinbudget-backend/types"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
)

func TestMakeJWT(t *testing.T) {
	user := types.User{
		ID: uuid.New(),
	}

	token, err := auth.MakeJWT(user)
	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	claims, err := auth.DecodeJWT(token)
	assert.NoError(t, err)
	assert.Equal(t, user.ID.String(), claims.Subject)
	assert.Equal(t, "keinbudget", claims.Issuer)
	assert.Equal(t, "webapp", claims.Audience[0])
}

func TestDecodeJWT(t *testing.T) {
	user := types.User{
		ID: uuid.New(),
	}

	token, err := auth.MakeJWT(user)
	assert.NoError(t, err)

	claims, err := auth.DecodeJWT(token)
	assert.NoError(t, err)
	assert.Equal(t, user.ID.String(), claims.Subject)
	assert.Equal(t, "keinbudget", claims.Issuer)
	assert.Equal(t, "webapp", claims.Audience[0])

	// Test with an invalid token
	_, err = auth.DecodeJWT("invalid-token")
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "error parsing token")
}

func TestExpiredJWT(t *testing.T) {
	user := types.User{
		ID: uuid.New(),
	}

	// Create a token with a past expiration date
	signingkey := []byte("my-secret-key")
	claims := auth.JWTClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:  "keinbudget",
			Subject: user.ID.String(),
			Audience: jwt.ClaimStrings{
				0: "webapp",
			},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(-time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(signingkey)
	assert.NoError(t, err)

	// Decode the expired token
	_, err = auth.DecodeJWT(tokenString)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "token is expired")
}
