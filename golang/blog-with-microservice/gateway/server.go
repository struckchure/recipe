package main

import (
	"github.com/gofiber/fiber/v2"

	"struckchure.recipe.gateway/handlers"
)

type Server struct {
	app *fiber.App
}

func (s *Server) Start() error {
	return s.app.Listen(":3000")
}

func NewServer() *Server {
	app := fiber.New()

	authHandler := handlers.NewAuthHandler()
	app.Post("/auth/login", authHandler.Login)
	app.Post("/auth/register", authHandler.Register)

	postHandler := handlers.NewPostHandler()
	app.Get("/posts", postHandler.List)
	app.Get("/posts/:id", postHandler.Get)
	app.Post("/posts", NewAuthMiddleware().Use, postHandler.Create)
	app.Patch("/posts/:id", NewAuthMiddleware().Use, postHandler.Update)
	app.Delete("/posts/:id", NewAuthMiddleware().Use, postHandler.Delete)

	return &Server{app: app}
}
