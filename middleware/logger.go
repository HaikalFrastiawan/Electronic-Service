package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

// LoggerMiddleware logs method, path, status, and latency for each request.
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method

		c.Next()

		fmt.Printf("[BOOKING-API] %s | %d | %s | %s %s\n",
			start.Format("2006/01/02 - 15:04:05"),
			c.Writer.Status(),
			time.Since(start),
			method,
			path,
		)
	}
}
