package repositories

import (
	"time"

	"github.com/cheetahybte/keinbudget/pkg/auth"
	"github.com/cheetahybte/keinbudget/types"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type CustomJWTClaims struct {
	Email string `json:"email"`
	Admin bool   `json:"admin"`
	jwt.RegisteredClaims
}

type UserRepository struct {
	db                   *sqlx.DB
	HashPasswordFunction func(password string) (string, error)
}

func NewUserRepository(db *sqlx.DB) *UserRepository {
	return &UserRepository{
		db:                   db,
		HashPasswordFunction: auth.HashPassword,
	}
}

func (r *UserRepository) CreateUser(email, password, name string) (*types.User, error) {
	hash, err := r.HashPasswordFunction(password)

	if err != nil {
		return nil, err
	}

	user := &types.User{
		ID:        uuid.New(),
		Email:     email,
		Username:  name,
		Password:  hash,
		CreatedAt: time.Now(),
	}
	_, err = r.db.NamedExec("insert into users(id, email, username, password) values(:id, :email, :username, :password)", &user)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (r *UserRepository) GetUserById(id uuid.UUID) (*types.User, error) {
	var user types.User
	err := r.db.Get(&user, "select * from users where id = $1", id)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) GetUserByEmail(email string) (*types.User, error) {
	var user types.User
	err := r.db.Get(&user, "select * from users where email = $1", email)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (r *UserRepository) Login(email, password string) (string, error) {
	user, err := r.GetUserByEmail(email)

	if err != nil {
		return "", err
	}

	err = auth.CheckPasswords(password, user.Password)
	if err != nil {
		return "", err
	}

	claims := &CustomJWTClaims{
		user.Email,
		true,
		jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 72)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// TODO: take this from env
	t, err := token.SignedString([]byte("secret"))

	if err != nil {
		return "", err
	}

	return t, nil
}

func (r *UserRepository) DeleteUser(id uuid.UUID) (bool, error) {
	// TODO: implement
	return true, nil
}
