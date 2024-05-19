package handlers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/mitchellh/mapstructure"

	"struckchure.recipe.gateway/clients"
	post_pb "struckchure.recipe.gateway/pb/posts"
)

type PostHandler struct {
	postsClient *clients.PostClient
}

func (a *PostHandler) List(c *fiber.Ctx) error {
	var payload post_pb.ListRequest

	mapstructure.Decode(c.Queries(), &payload)

	response, err := a.postsClient.List(&payload)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func (a *PostHandler) Create(c *fiber.Ctx) error {
	var payload post_pb.CreateRequest

	if err := json.Unmarshal(c.Body(), &payload); err != nil {
		return err
	}

	response, err := a.postsClient.Create(&payload)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func (a *PostHandler) Get(c *fiber.Ctx) error {
	var payload post_pb.GetRequest

	payload.Id = c.Params("id")

	response, err := a.postsClient.Get(&payload)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func (a *PostHandler) Update(c *fiber.Ctx) error {
	var payload post_pb.UpdateRequest

	if err := json.Unmarshal(c.Body(), &payload); err != nil {
		return err
	}

	payload.Id = c.Params("id")

	response, err := a.postsClient.Update(&payload)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(response)
}

func (a *PostHandler) Delete(c *fiber.Ctx) error {
	var payload post_pb.DeleteRequest

	payload.Id = c.Params("id")

	_, err := a.postsClient.Delete(&payload)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusNoContent).JSON(nil)
}

func NewPostHandler() *PostHandler {
	return &PostHandler{postsClient: clients.NewPostClient()}
}
