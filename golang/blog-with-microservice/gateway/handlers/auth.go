package handlers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"

	"struckchure.recipe.gateway/clients"
	auth_pb "struckchure.recipe.gateway/pb/auth"
)

type AuthHandler struct {
	authClient *clients.AuthClient
}

func (a *AuthHandler) Login(c *fiber.Ctx) error {
	var payload auth_pb.LoginRequest

	if err := json.Unmarshal(c.Body(), &payload); err != nil {
		return err
	}

	response, err := a.authClient.Login(&payload)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func (a *AuthHandler) Register(c *fiber.Ctx) error {
	var payload auth_pb.RegisterRequest

	if err := json.Unmarshal(c.Body(), &payload); err != nil {
		return err
	}

	response, err := a.authClient.Register(&payload)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{authClient: clients.NewAuthClient()}
}
