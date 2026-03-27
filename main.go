package main

import (
	"booking-service/config"
	"booking-service/models"
	"booking-service/routes"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

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

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: r,
	}

	// Initializing the server in a goroutine so that it won't block the graceful shutdown handling below
	go func() {
		fmt.Printf("Server running on port %s...\n", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with a timeout of 5 seconds.
	quit := make(chan os.Signal, 1)
	// kill (no param) default send syscall.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall.SIGKILL but can't be caught, so no need to add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// The context is used to inform the server it has 5 seconds to finish the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}