package server

import (
	"github.com/gofiber/fiber/v2"
	"github.com/guneyin/bistory/api"
)

func (s *HttpServer) RegisterRoutes() {
	s.App.Get("/", func(c *fiber.Ctx) error {
		return c.Render("index", fiber.Map{})
	})

	v1 := s.App.Group("/api/v1")
	v1.Get("/symbols", api.GetSymbolListHandler)
	v1.Get("/quote", api.GetQuoteHandler)
	v1.Get("/quote-with-history", api.GetQuoteWithHistoryHandler)
}
