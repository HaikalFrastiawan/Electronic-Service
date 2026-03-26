package testhelper

import (
	"booking-service/config"
	"booking-service/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// SetupTestDB menginisialisasi koneksi DB untuk keperluan testing
func SetupTestDB() {
	// Load .env dari beberapa kemungkinan path
	paths := []string{".env", "../.env", "../../.env"}
	for _, p := range paths {
		if err := godotenv.Load(p); err == nil {
			break
		}
	}

	// Gunakan database test terpisah agar tidak mengotori data produksi
	os.Setenv("DB_NAME", "booking_db_test")
	if os.Getenv("JWT_SECRET") == "" {
		os.Setenv("JWT_SECRET", "test_secret_key")
	}

	// Auto-create test database jika belum ada
	ensureTestDatabaseExists()

	config.ConnectDatabase()
	MigrateTestDB()
}

// ensureTestDatabaseExists membuat database test jika belum ada
func ensureTestDatabaseExists() {
	host := getEnvOrDefault("DB_HOST", "localhost")
	user := getEnvOrDefault("DB_USER", "postgres")
	password := getEnvOrDefault("DB_PASSWORD", "1125")
	port := getEnvOrDefault("DB_PORT", "5432")

	// Koneksi ke database 'postgres' (database default yang selalu ada)
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=postgres port=%s sslmode=disable",
		host, user, password, port,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Test: gagal koneksi ke postgres untuk buat test DB: ", err)
	}

	// Buat database booking_db_test jika belum ada
	result := db.Exec("CREATE DATABASE booking_db_test")
	if result.Error != nil {
		// Jika error karena sudah ada, itu OK
		fmt.Println("[TEST] Database booking_db_test sudah ada, lanjut...")
	} else {
		fmt.Println("[TEST] Database booking_db_test berhasil dibuat!")
	}

	sqlDB, _ := db.DB()
	sqlDB.Close()
}

// MigrateTestDB menjalankan AutoMigrate untuk semua model di test DB
func MigrateTestDB() {
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Customer{},
		&models.Technician{},
		&models.Booking{},
	)
	if err != nil {
		log.Fatal("Test AutoMigrate gagal: ", err)
	}
	fmt.Println("[TEST] Database test siap")
}

// CleanupTable menghapus semua data dari tabel tertentu (untuk reset antar test)
func CleanupTable(tableName string) {
	config.DB.Exec(fmt.Sprintf("DELETE FROM %s", tableName))
	// Reset auto-increment ID
	config.DB.Exec(fmt.Sprintf("ALTER SEQUENCE IF EXISTS %s_id_seq RESTART WITH 1", tableName))
}

func getEnvOrDefault(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
