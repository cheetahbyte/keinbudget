package config

import (
	"fmt"
	"os"
	"strconv"
)

type CorsConfig struct {
	Origins []string
	Methods []string
	Headers []string
	MaxAge  uint32
}

type KeinbudgetConfig struct {
	Addr     string
	Port     int
	DBDriver string
	DBString string
	Cors     *CorsConfig
}

func GetConfig() (*KeinbudgetConfig, error) {
	addr := os.Getenv("ADDR")

	portStr := os.Getenv("PORT")
	if portStr == "" {
		portStr = "3000"
	}

	port, err := strconv.Atoi(portStr)
	if err != nil {
		return nil, fmt.Errorf("invalid PORT value: %s", portStr)
	}

	dbDriver := os.Getenv("DB_DRIVER")
	if dbDriver == "" {
		return nil, fmt.Errorf("DB_DRIVER environment variable not set")
	}

	dbString := os.Getenv("DB_STRING")
	if dbString == "" {
		return nil, fmt.Errorf("DB_STRING environment variable not set")
	}

	corsConfig := &CorsConfig{
		Origins: []string{"http://localhost:5173"},
		Methods: []string{"GET", "POST"},
		Headers: []string{"Content-Type", "Authorization"}, // Add headers as needed
		MaxAge:  86400,                                     // Example max age (in seconds)
	}

	config := &KeinbudgetConfig{
		Addr:     addr,
		Port:     port,
		DBDriver: dbDriver,
		DBString: dbString,
		Cors:     corsConfig,
	}

	return config, nil
}
