// cmd/api/main.go
package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/Unleash/unleash-client-go/v4"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
	"github.com/gofiber/storage/redis/v3"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
	"github.com/keinbudget/backend/internal/api"
	db "github.com/keinbudget/backend/internal/db"
	"github.com/keinbudget/backend/internal/service/auth"
)

func initUnleash() {
	unleash.Initialize(
		unleash.WithListener(&unleash.DebugListener{}),
		unleash.WithAppName("keinbudget-backend"),
		unleash.WithUrl(os.Getenv("UNLEASH_SERVER")),
		unleash.WithCustomHeaders(http.Header{"Authorization": {os.Getenv("UNLEASH_TOKEN")}}),
	)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	dsn := os.Getenv("DATABASE_URL")
	conn, err := sql.Open("pgx", dsn)
	if err != nil {
		log.Fatal("❌ cannot connect to db:", err)
	}
	defer conn.Close()
	initUnleash()
	unleash.WaitForReady()

	redisStore := redis.New(redis.Config{
		Host:     os.Getenv("REDIS_HOST"),     // z.B. "localhost"
		Port:     6379,                        // Redis-Standardport
		Password: os.Getenv("REDIS_PASSWORD"), // leer wenn ohne Auth
		Database: 0,                           // Redis DB-Index
	})

	// 2. Komponenten initialisieren
	auth.InitWebAuthn()
	auth.DB = db.New(conn)
	auth.Store = session.New(session.Config{
		Storage:      redisStore,
		Expiration:   24 * time.Hour,
		CookieSecure: false,
	})

	// 3. Fiber starten
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:4000",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
		AllowMethods:     "*",
	}))

	// 4. Healthcheck
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	// 5. Routen
	api.RegisterAuthRoutes(app)
	api.RegisterWalletRoutes(app)

	log.Println("🚀 Server läuft auf http://localhost:3000")
	log.Fatal(app.Listen(":3000"))
}
