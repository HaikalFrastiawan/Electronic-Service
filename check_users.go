package main

import (
	"booking-service/config"
	"booking-service/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatal("Error loading .env file")
	}

	config.ConnectDatabase()

	var users []models.User
	if err := config.DB.Find(&users).Error; err != nil {
		log.Fatal(err)
	}

	f, err := os.Create("users.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	fmt.Fprintln(f, "--- START USERS ---")
	for _, u := range users {
		fmt.Fprintf(f, "USER: Email=%s | Role=%s | PasswordHash=%s\n", u.Email, u.Role, u.Password)
	}
	if len(users) == 0 {
		fmt.Fprintln(f, "RESULT: No users found.")
	}
	fmt.Fprintln(f, "--- END USERS ---")
}
