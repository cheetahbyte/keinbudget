package auth

import (
	"fmt"
	"time"

	"github.com/cheetahybte/keinbudget/types"
	"github.com/golang-jwt/jwt/v5"
)

type JWTClaims struct {
	jwt.RegisteredClaims
}

func MakeJWT(user types.User) (string, error) {
	signingkey := []byte("my-secret-key")
	claims := JWTClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:  "keinbudget",
			Subject: user.ID.String(),
			Audience: jwt.ClaimStrings{
				0: "webapp",
			},
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 24)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(signingkey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func DecodeJWT(token string) (*JWTClaims, error) {
	t, err := jwt.ParseWithClaims(token, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("my-secret-key"), nil
	})
	if err != nil {
		return nil, fmt.Errorf("error parsing token: %v", err)
	}

	if claims, ok := t.Claims.(*JWTClaims); ok && t.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token")
}
