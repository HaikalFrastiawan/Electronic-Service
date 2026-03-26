package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func setupAuthTestDB(t *testing.T) {
	t.Helper()
	paths := []string{".env", "../.env"}
	for _, p := range paths {
		godotenv.Load(p)
	}
	os.Setenv("DB_NAME", "booking_db_test")
	os.Setenv("JWT_SECRET", "test_secret_key")
	config.ConnectDatabase()
	config.DB.AutoMigrate(&models.User{})
}

func TestRegister_Success(t *testing.T) {
	setupAuthTestDB(t)
	config.DB.Exec("DELETE FROM users WHERE email = 'test@test.com'")

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/auth/register", Register)

	body := map[string]string{
		"name":     "Test Admin",
		"email":    "test@test.com",
		"password": "password123",
		"role":     "admin",
	}
	jsonValue, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.Equal(t, "Registrasi berhasil!", resp["message"])
}

func TestRegister_DuplicateEmail(t *testing.T) {
	setupAuthTestDB(t)

	// Pastikan user sudah ada
	config.DB.Exec("DELETE FROM users WHERE email = 'duplicate@test.com'")

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/auth/register", Register)

	body := map[string]string{
		"name": "User Duplikat", "email": "duplicate@test.com", "password": "pass123",
	}
	jsonValue, _ := json.Marshal(body)

	// Register pertama
	req1, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonValue))
	req1.Header.Set("Content-Type", "application/json")
	w1 := httptest.NewRecorder()
	r.ServeHTTP(w1, req1)
	require.Equal(t, http.StatusCreated, w1.Code)

	// Register kedua dengan email sama
	req2, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonValue))
	req2.Header.Set("Content-Type", "application/json")
	w2 := httptest.NewRecorder()
	r.ServeHTTP(w2, req2)
	assert.Equal(t, http.StatusConflict, w2.Code)
}

func TestRegister_InvalidInput(t *testing.T) {
	setupAuthTestDB(t)

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/auth/register", Register)

	// Kirim tanpa email (required field)
	body := map[string]string{"name": "No Email User", "password": "pass123"}
	jsonValue, _ := json.Marshal(body)

	req, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestLogin_Success(t *testing.T) {
	setupAuthTestDB(t)
	config.DB.Exec("DELETE FROM users WHERE email = 'login@test.com'")

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/auth/register", Register)
	r.POST("/api/auth/login", Login)

	// Register user dulu
	regBody := map[string]string{
		"name": "Login User", "email": "login@test.com", "password": "secret123",
	}
	jsonReg, _ := json.Marshal(regBody)
	reqReg, _ := http.NewRequest("POST", "/api/auth/register", bytes.NewBuffer(jsonReg))
	reqReg.Header.Set("Content-Type", "application/json")
	wReg := httptest.NewRecorder()
	r.ServeHTTP(wReg, reqReg)
	require.Equal(t, http.StatusCreated, wReg.Code)

	// Login
	loginBody := map[string]string{"email": "login@test.com", "password": "secret123"}
	jsonLogin, _ := json.Marshal(loginBody)
	req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonLogin))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	assert.NotEmpty(t, resp["token"], "Token JWT harus ada di response")
	assert.Equal(t, "Login berhasil!", resp["message"])
}

func TestLogin_WrongPassword(t *testing.T) {
	setupAuthTestDB(t)

	gin.SetMode(gin.TestMode)
	r := gin.Default()
	r.POST("/api/auth/login", Login)

	body := map[string]string{"email": "login@test.com", "password": "password_salah"}
	jsonValue, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(jsonValue))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}
