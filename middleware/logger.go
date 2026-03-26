package middleware

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
)

// LoggerMiddleware mencatat setiap request: method, path, status, dan latency
func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		method := c.Request.Method

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()
		clientIP := c.ClientIP()

		fmt.Printf("[BOOKING-API] %s | %d | %s | %s %s\n",
			start.Format("2006/01/02 - 15:04:05"),
			status,
			latency,
			method,
			path,
		)
		_ = clientIP
	}
}
