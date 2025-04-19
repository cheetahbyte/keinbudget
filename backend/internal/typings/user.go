package typings

import "github.com/google/uuid"

type (
	User struct {
		ID        uuid.UUID `json:"id"`
		Email     string    `json:"email"`
		Password  string    `json:"password"`
		FirstName string    `json:"firstName"`
		LastName  string    `json:"lastName"`
	}

	UserSafe struct {
		ID        uuid.UUID `json:"id"`
		Email     string    `json:"email"`
		FirstName string    `json:"firstName"`
		LastName  string    `json:"lastName"`
	}
	LoginDTO struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	CreateUserDTO struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
)
