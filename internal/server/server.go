package server

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/template/html/v2"
)

type HttpServer struct {
	*fiber.App

	//db database.Service
}

func New() *HttpServer {
	engine := html.New("./web", ".html")

	// Disable this in production
	engine.Reload(true)

	s := &HttpServer{
		App: fiber.New(fiber.Config{
			ServerHeader: "bistory server",
			AppName:      "bistory",
			Views:        engine,
			ViewsLayout:  "layout/main",
		}),

		//db: database.New(),
	}
	s.Static("/assets", "./web/assets")

	return s
}
