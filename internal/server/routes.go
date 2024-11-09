package server

import (
	"github.com/guneyin/bistory/api"
	"github.com/guneyin/bistory/web"
)

func (s *HttpServer) RegisterRoutes() {
	s.App.Get("/", web.Index)
	
	v1 := s.App.Group("/api/v1")
	v1.Get("/symbols", api.GetSymbolListHandler)
	v1.Get("/quote", api.GetQuoteHandler)
	v1.Get("/quote-with-history", api.GetQuoteWithHistoryHandler)
}
