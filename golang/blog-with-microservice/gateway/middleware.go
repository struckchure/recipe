package main

import (
	"github.com/gofiber/fiber/v2"

	"struckchure.recipe.gateway/utils"
)

type AuthMiddleware struct {
	encryption utils.Encryption
}

func (m AuthMiddleware) Use(c *fiber.Ctx) error {
	authToken := c.Get("Authorization", "")
	if len(authToken) == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "authorization header is missing"})
	}

	userId, err := m.encryption.Decrypt(authToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	c.Locals("userId", userId)

	return c.Next()
}

func NewAuthMiddleware() AuthMiddleware {
	return AuthMiddleware{encryption: *utils.NewEncryption("simple-key")}
}
