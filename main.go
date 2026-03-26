package main

import (
	"booking-service/config"
	"booking-service/models"
	"booking-service/routes"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env not found, using system environment variables")
	}

	config.ConnectDatabase()

	// Drop bookings table to reapply schema (dev only — remove after first clean migration)
	if config.DB.Migrator().HasTable(&models.Booking{}) {
		if err := config.DB.Migrator().DropTable(&models.Booking{}); err != nil {
			log.Fatal("Failed to drop bookings table:", err)
		}
		log.Println("Bookings table dropped for re-migration.")
	}

	if err := config.DB.AutoMigrate(
		&models.User{},
		&models.Customer{},
		&models.Technician{},
		&models.Booking{},
	); err != nil {
		log.Fatal("AutoMigrate failed:", err)
	}
	fmt.Println("AutoMigrate successful!")

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	r := routes.SetupRouter()
	fmt.Printf("Server running on port %s...\n", port)
	r.Run(":" + port)
}