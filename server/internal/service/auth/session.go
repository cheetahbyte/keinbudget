package auth

import "github.com/gofiber/fiber/v2/middleware/session"

var Store = session.New()