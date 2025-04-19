package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Secret      []byte
	DatabaseUrl string
}

func New() *Config {
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Fatalf("JWT_SECRET not set.")
	}

	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatalf("DATABASE_URL not set.")
	}

	return &Config{
		Secret:      []byte(jwtSecret),
		DatabaseUrl: databaseUrl,
	}
}
