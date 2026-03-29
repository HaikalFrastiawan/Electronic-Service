package main

import (
	"booking-service/config"
	"booking-service/models"
	"fmt"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	config.ConnectDatabase()

	var user models.User
	config.DB.Where("email = ?", "haikalfrastiawan16@gmail.com").First(&user)
	fmt.Printf("Admin Email: %s\n", user.Email)
	fmt.Printf("Admin Password Hash: %s\n", user.Password)
	fmt.Printf("Is Hashed: %v\n", user.Password != "" && user.Password[0] == '$')

	var customer models.User
	config.DB.Where("email = ?", "budi@example.com").First(&customer)
	fmt.Printf("Customer Email: %s\n", customer.Email)
	fmt.Printf("Customer Password Hash: %s\n", customer.Password)
	fmt.Printf("Is Hashed: %v\n", customer.Password != "" && customer.Password[0] == '$')
}
