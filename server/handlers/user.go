package handlers

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"golang.org/x/crypto/argon2"
)

type UserHandler struct {
	DB *sqlx.DB
}

type User struct {
	ID        uuid.UUID `db:"id"`
	Username  string    `json:"usernane" db:"username"`
	Password  string    `json:"password" db:"password"`
	CreatedAt string    `json:"created_at" db:"created_at"`
}

type Session struct {
	ID        uuid.UUID `db:"id"`
	UserID    uuid.UUID `db:"user_id"`
	CreatedAt string    `db:"createdAt"`
}

type UserDataDTO struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (handler *UserHandler) NewUser(c *fiber.Ctx) error {
	var userData UserDataDTO

	if err := c.BodyParser(&userData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	if userData.Username == "" || userData.Password == "" {
		return c.Status(fiber.StatusUnprocessableEntity).SendString("no password or username specified")
	}

	hash, err := hashPassword(userData.Password, buildArgon2Params())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	user := User{ID: uuid.New(), Username: userData.Username, Password: string(hash)}

	tx := handler.DB.MustBegin()

	_, err = tx.NamedExec("insert into users (id, username, password) values(:id, :username, :password);", &user)

	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusConflict).SendString(err.Error())
	}

	if err := tx.Commit(); err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return nil
}

func (handler *UserHandler) LoginUser(c *fiber.Ctx) error {
	var loginData UserDataDTO

	if err := c.BodyParser(&loginData); err != nil {
		return c.Status(fiber.StatusUnprocessableEntity).SendString(err.Error())
	}

	var foundUser User

	err := handler.DB.Get(&foundUser, "select * from users where username=$1", loginData.Username)

	if err != nil {
		return c.Status(fiber.StatusNotFound).SendString(err.Error())
	}

	match, err := verifyPassword(loginData.Password, foundUser.Password)

	if !match {
		return c.Status(fiber.StatusUnauthorized).SendString("passwords not matching")
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	session := Session{
		ID:     uuid.New(),
		UserID: foundUser.ID,
	}

	tx := handler.DB.MustBegin()
	_, err = tx.NamedExec("insert into sessions(id, user_id) values(:id, :user_id)", &session)
	if err != nil {
		tx.Rollback()
		return c.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	tx.Commit()

	keks := fiber.Cookie{
		Name:    "session",
		Value:   session.ID.String(),
		Expires: time.Now().Add(24 * time.Hour),
	}

	c.Cookie(&keks)
	c.Response().Header.Add("Content-Type", "application/json")
	return c.SendString("{ok: 1}")
}

type Argon2Params struct {
	Memory      uint32
	Iterations  uint32
	Parallelism uint8
	SaltLength  uint32
	KeyLength   uint32
}

func buildArgon2Params() *Argon2Params {
	return &Argon2Params{
		Memory:      64 * 1024,
		Iterations:  3,
		Parallelism: 2,
		SaltLength:  16,
		KeyLength:   32,
	}
}

func hashPassword(password string, p *Argon2Params) (encodedHash string, err error) {
	salt, err := generateRandomBytes(p.SaltLength)
	if err != nil {
		return "", err
	}

	hash := argon2.IDKey([]byte(password), salt, p.Iterations, p.Memory, p.Parallelism, p.KeyLength)

	b64Salt := base64.RawStdEncoding.EncodeToString(salt)
	b64Hash := base64.RawStdEncoding.EncodeToString(hash)

	encodedHash = fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s", argon2.Version, p.Memory, p.Iterations, p.Parallelism, b64Salt, b64Hash)

	return encodedHash, nil
}

func generateRandomBytes(n uint32) ([]byte, error) {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}
	return b, nil
}

var (
	ErrHashInvalid             = errors.New("hash is weird")
	ErrHashVersionIncompatible = errors.New("hash version is not good")
)

func verifyPassword(password, encodedHash string) (match bool, err error) {
	p, salt, hash, err := decodeHash(encodedHash)
	if err != nil {
		return false, err
	}

	otherHash := argon2.IDKey([]byte(password), salt, p.Iterations, p.Memory, p.Parallelism, p.KeyLength)

	if subtle.ConstantTimeCompare(hash, otherHash) == 1 {
		return true, nil
	}

	return false, nil

}

func decodeHash(encodedHash string) (p *Argon2Params, salt, hash []byte, err error) {
	vals := strings.Split(encodedHash, "$")
	if len(vals) != 6 {
		return nil, nil, nil, ErrHashInvalid
	}

	var version int
	_, err = fmt.Sscanf(vals[2], "v=%d", &version)
	if err != nil {
		return nil, nil, nil, err
	}
	if version != argon2.Version {
		return nil, nil, nil, ErrHashVersionIncompatible
	}

	p = &Argon2Params{}
	_, err = fmt.Sscanf(vals[3], "m=%d,t=%d,p=%d", &p.Memory, &p.Iterations, &p.Parallelism)
	if err != nil {
		return nil, nil, nil, err
	}

	salt, err = base64.RawStdEncoding.Strict().DecodeString(vals[4])

	if err != nil {
		return nil, nil, nil, err
	}
	p.SaltLength = uint32(len(salt))

	hash, err = base64.RawStdEncoding.Strict().DecodeString(vals[5])
	if err != nil {
		return nil, nil, nil, err
	}
	p.KeyLength = uint32(len(hash))

	return p, salt, hash, nil
}
