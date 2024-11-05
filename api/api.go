package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/guneyin/gobist"
	"strings"
	"sync"
	"time"
)

var (
	once sync.Once
	bist *gobist.Bist
)

func init() {
	once.Do(func() {
		bist = gobist.New()
	})
}

func GetSymbolListHandler(c *fiber.Ctx) error {
	list, err := bist.GetSymbolList()
	if err != nil {
		return err
	}

	return c.JSON(list)
}

func GetQuoteHandler(c *fiber.Ctx) error {
	sl := c.Query("symbols")
	symbols := strings.Split(sl, ",")

	if len(symbols) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "invalid query parameters. check symbol value")
	}

	quote, err := bist.GetQuote(symbols)
	if err != nil {
		return err
	}

	return c.JSON(quote)
}

func GetQuoteWithHistoryHandler(c *fiber.Ctx) error {
	sl := c.Query("symbols")
	dt := c.Query("period")

	symbols := strings.Split(sl, ",")
	period := strings.Split(dt, ",")

	if len(symbols) == 0 || len(period) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "invalid query parameters. check symbol and dates values")
	}

	var dts []time.Time

	dtBegin, err := time.Parse(time.DateOnly, period[0])
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid date format")
	}
	dts = append(dts, dtBegin)

	if len(period) == 2 {
		dtEnd, err := time.Parse(time.DateOnly, period[1])
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid date format")
		}
		dts = append(dts, dtEnd)
	}

	history, err := bist.GetQuoteWithHistory(symbols, dts...)
	if err != nil {
		return err
	}

	return c.JSON(history)
}
