package server

import (
	"github.com/gofiber/fiber/v2"
	"github.com/guneyin/bistory/internal/database"
)

type FiberServer struct {
	*fiber.App

	db database.Service
}

func New() *FiberServer {
	server := &FiberServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "bistory server",
			AppName:      "bistory",
		}),

		db: database.New(),
	}

	return server
}
