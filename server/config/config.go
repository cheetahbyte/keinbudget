package config

import (
	"fmt"
	"os"
	"strconv"
)

type KeinbudgetConfig struct {
	Port     int
	DBDriver string
	DBString string
}

func GetConfig() (*KeinbudgetConfig, error) {
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

	config := &KeinbudgetConfig{
		Port:     port,
		DBDriver: dbDriver,
		DBString: dbString,
	}

	return config, nil
}
