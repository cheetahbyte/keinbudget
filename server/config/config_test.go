package config_test

import (
	"os"
	"testing"

	"github.com/cheetahybte/keinbudget/config"
)

func setEnvVariables(envVars map[string]string) {
	for key, value := range envVars {
		os.Setenv(key, value)
	}
}

func unsetEnvVariables(envVars []string) {
	for _, key := range envVars {
		os.Unsetenv(key)
	}
}

func TestGetConfig(t *testing.T) {
	// Backup current environment variables and defer restoration
	envVars := []string{"ADDR", "PORT", "DB_DRIVER", "DB_STRING"}
	backupEnv := make(map[string]string)
	for _, key := range envVars {
		backupEnv[key] = os.Getenv(key)
	}
	defer func() {
		setEnvVariables(backupEnv)
	}()

	t.Run("successful configuration", func(t *testing.T) {
		setEnvVariables(map[string]string{
			"ADDR":      "localhost",
			"PORT":      "8080",
			"DB_DRIVER": "postgres",
			"DB_STRING": "user:password@/dbname",
		})
		defer unsetEnvVariables(envVars)

		config, err := config.GetConfig()
		if err != nil {
			t.Fatalf("expected no error, got %v", err)
		}

		if config.Addr != "localhost" {
			t.Errorf("expected Addr to be 'localhost', got %s", config.Addr)
		}
		if config.Port != 8080 {
			t.Errorf("expected Port to be 8080, got %d", config.Port)
		}
		if config.DBDriver != "postgres" {
			t.Errorf("expected DBDriver to be 'postgres', got %s", config.DBDriver)
		}
		if config.DBString != "user:password@/dbname" {
			t.Errorf("expected DBString to be 'user:password@/dbname', got %s", config.DBString)
		}
	})

	t.Run("missing DB_DRIVER", func(t *testing.T) {
		setEnvVariables(map[string]string{
			"ADDR":      "localhost",
			"PORT":      "8080",
			"DB_STRING": "user:password@/dbname",
		})
		defer unsetEnvVariables(envVars)

		_, err := config.GetConfig()
		if err == nil {
			t.Fatal("expected an error due to missing DB_DRIVER, got none")
		}
		expectedError := "DB_DRIVER environment variable not set"
		if err.Error() != expectedError {
			t.Errorf("expected error: %s, got %s", expectedError, err.Error())
		}
	})

	t.Run("missing DB_STRING", func(t *testing.T) {
		setEnvVariables(map[string]string{
			"ADDR":      "localhost",
			"PORT":      "8080",
			"DB_DRIVER": "postgres",
		})
		defer unsetEnvVariables(envVars)

		_, err := config.GetConfig()
		if err == nil {
			t.Fatal("expected an error due to missing DB_STRING, got none")
		}
		expectedError := "DB_STRING environment variable not set"
		if err.Error() != expectedError {
			t.Errorf("expected error: %s, got %s", expectedError, err.Error())
		}
	})

	t.Run("invalid PORT value", func(t *testing.T) {
		setEnvVariables(map[string]string{
			"ADDR":      "localhost",
			"PORT":      "invalid_port",
			"DB_DRIVER": "postgres",
			"DB_STRING": "user:password@/dbname",
		})
		defer unsetEnvVariables(envVars)

		_, err := config.GetConfig()
		if err == nil {
			t.Fatal("expected an error due to invalid PORT, got none")
		}
		expectedError := "invalid PORT value: invalid_port"
		if err.Error() != expectedError {
			t.Errorf("expected error: %s, got %s", expectedError, err.Error())
		}
	})
}
