package server

import (
	"bistory/cmd/web"
	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"net/http"
)

func (s *FiberServer) RegisterFiberRoutes() {
	s.App.Get("/", s.HelloWorldHandler)

	s.App.Get("/health", s.healthHandler)

	s.App.Use("/assets", filesystem.New(filesystem.Config{
		Root:       http.FS(web.Files),
		PathPrefix: "assets",
		Browse:     false,
	}))

	s.App.Get("/web", adaptor.HTTPHandler(templ.Handler(web.HelloForm())))

	s.App.Post("/hello", func(c *fiber.Ctx) error {
		return web.HelloWebHandler(c)
	})

}

func (s *FiberServer) HelloWorldHandler(c *fiber.Ctx) error {
	resp := fiber.Map{
		"message": "Hello World",
	}

	return c.JSON(resp)
}

func (s *FiberServer) healthHandler(c *fiber.Ctx) error {
	return c.JSON(s.db.Health())
}
