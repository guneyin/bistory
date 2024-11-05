package server

import (
	"github.com/a-h/templ"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"github.com/guneyin/bistory/api"
	"github.com/guneyin/bistory/web"
	"net/http"
)

func (s *FiberServer) RegisterFiberRoutes() {
	// web routes
	s.App.Get("/health", s.healthHandler)
	s.App.Use("/assets", filesystem.New(filesystem.Config{
		Root:       http.FS(web.Files),
		PathPrefix: "assets",
		Browse:     false,
	}))
	s.App.Get("/", adaptor.HTTPHandler(templ.Handler(web.Index())))

	// api routes
	v1 := s.App.Group("/api/v1")
	v1.Get("/symbols", api.GetSymbolListHandler)
	v1.Get("/quote", api.GetQuoteHandler)
	v1.Get("/quote-with-history", api.GetQuoteWithHistoryHandler)
}

func (s *FiberServer) healthHandler(c *fiber.Ctx) error {
	return c.JSON(s.db.Health())
}
