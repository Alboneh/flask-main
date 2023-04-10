package main

import (
	api "api/handler"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	jwtware "github.com/gofiber/jwt/v3"
)

// coba
func main() {
	app := fiber.New()
	app.Use(cors.New())

	app.Get("/", api.Get)
	app.Post("/login", api.Login)

	// JWT Middleware
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte("secret"),
	}))
	app.Get("/predict", api.Predict)
	app.Get("/predict/:product_name", api.PredictProduct)
	app.Post("/predict", api.UploadFIle)

	app.Listen(":3030")
}
