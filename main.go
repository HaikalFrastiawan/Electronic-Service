package main

import (
	"booking-service/config"
	"github.com/gin-gonic/gin"
)

func main() {
	
	config.ConnectDatabase()
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "Server & DB Aktif!"})
	})

	r.Run(":8080")
}