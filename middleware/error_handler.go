package middleware

import (
	"booking-service/utils"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorHandler handles panics and errors globally
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("Panic recovered: %v", err)
				utils.ErrorResponse(c, http.StatusInternalServerError, "Internal Server Error")
				c.Abort()
			}
		}()

		c.Next()

		// Handle errors attached to context
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err
			log.Printf("Context error: %v", err)
			utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		}
	}
}
