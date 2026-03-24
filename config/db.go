package config

import (
	"fmt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func ConnectDatabase() {
	
	dsn := "host=localhost user=postgres password=1125 dbname=booking_db port=5432 sslmode=disable"
	
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Gagal terhubung ke database: ", err)
	}

	fmt.Println("Berhasil terkoneksi ke Database!")
	DB = database
}