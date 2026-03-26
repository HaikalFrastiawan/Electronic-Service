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
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("Peringatan: File .env tidak ditemukan, menggunakan environment variable sistem")
	}

	// Koneksi ke database
	config.ConnectDatabase()

	// Auto migrate semua model
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Customer{},
		&models.Technician{},
		&models.Booking{},
	)
	if err != nil {
		log.Fatal("AutoMigrate gagal: ", err)
	}
	fmt.Println("AutoMigrate berhasil!")

	// Setup dan jalankan server
	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8080"
	}

	r := routes.SetupRouter()
	fmt.Printf("Server berjalan di port %s...\n", port)
	r.Run(":" + port)
}