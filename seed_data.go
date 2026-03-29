//go:build ignore
// +build ignore

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
	// Memuat .env jika ada
	if err := godotenv.Load(); err != nil {
		log.Println("Info: .env file not found")
	}

	// FORCED: Arahkan ke Production Database Neon (dari request)
	os.Setenv("DB_HOST", "ep-sparkling-water-a1m31gcb-pooler.ap-southeast-1.aws.neon.tech")
	os.Setenv("DB_USER", "neondb_owner")
	os.Setenv("DB_PASSWORD", "npg_qnAF8RCKwS4a")
	os.Setenv("DB_NAME", "neondb")
	os.Setenv("DB_SSLMODE", "require")

	// Terhubung ke Database yang ditentukan environment variables
	config.ConnectDatabase()

	// 1. Tambah Akun Admin Buatan (Haikal)
	fmt.Println("Memasukkan akun khusus: haikalfrastiawan16@gmail.com ...")
	admin := models.User{
		Name:     "Haikal Frastiawan (Admin)",
		Email:    "haikalfrastiawan16@gmail.com",
		Password: "Qweasdzxc#1125",
		Role:     "admin",
	}

	if err := config.DB.Where("email = ?", admin.Email).FirstOrCreate(&admin).Error; err != nil {
		fmt.Println("Gagal menambahkan admin:", err)
	} else {
		// Jika user sudah ada tapi kita ingin memastikan password benar (opsional)
		// Karena FirstOrCreate tidak akan update password jika user sudah ada.
		// Untuk testing, kita paksa update passwordnya agar tidak double-hash dari run sebelumnya.
		config.DB.Model(&admin).Update("password", "Qweasdzxc#1125")
		fmt.Println("✅ Admin User berhasil disiapkan!")
	}

	// 1.b Tambah Akun Customer Pengetesan
	fmt.Println("Memasukkan akun customer testing ...")
	customerUser := models.User{
		Name:     "Budi Santoso (Customer)",
		Email:    "budi@example.com",
		Password: "customer123",
		Role:     "customer",
	}

	if err := config.DB.Where("email = ?", customerUser.Email).FirstOrCreate(&customerUser).Error; err != nil {
		fmt.Println("Gagal menambahkan customer:", err)
	} else {
		config.DB.Model(&customerUser).Update("password", "customer123")
		fmt.Println("✅ Customer User berhasil disiapkan!")
	}

	// 2. Tambah Suku Cadang Awal
	fmt.Println("Memasukkan list stok suku cadang awal ...")
	spareparts := []models.Sparepart{
		{Name: "Layar LED 32 inch", Brand: "Samsung/OEM", Stock: 10, Price: 850000},
		{Name: "Layar LED 32 inch", Brand: "LG/OEM", Stock: 5, Price: 900000},
		{Name: "IC Power", Brand: "Original", Stock: 25, Price: 150000},
		{Name: "Kabel Flex", Brand: "Generic", Stock: 50, Price: 75000},
	}

	for _, part := range spareparts {
		if err := config.DB.Where("name = ? AND brand = ?", part.Name, part.Brand).FirstOrCreate(&part).Error; err != nil {
			fmt.Printf("Gagal insert %s: %v\n", part.Name, err)
		} else {
			fmt.Printf("✅ Sparepart '%s (%s)' siap dengan stok %d!\n", part.Name, part.Brand, part.Stock)
		}
	}

	fmt.Println("\n==============================")
	fmt.Println("⚙️ DATA SEEDING SUKSES!")
	fmt.Println("Silahkan Login di website Vercelmu.")
	fmt.Println("==============================")
}
