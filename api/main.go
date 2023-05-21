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
	app.Post("/register", api.Register)
	app.Put("/register/:id", api.UserEdit)
	app.Delete("/register/:id", api.UserDelete)

	app.Get("/download", api.Download)

	// JWT Middleware
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: []byte("secret"),
	}))
	app.Get("/predict", api.Predict)
	app.Get("/predict/:product_name", api.PredictProduct)
	app.Post("/upload", api.UploadFIle)
	app.Get("/check", api.Checkfile)
	app.Get("/users", api.GetUser)
	app.Get("/readcsv", api.GetOriginData)
	app.Post("/crudcsv", api.Create)
	app.Put("/crudcsv", api.Update)
	app.Delete("/crudcsv", api.Delete)

	app.Listen(":3030")
}
