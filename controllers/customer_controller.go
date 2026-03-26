package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateCustomer menambah pelanggan baru
func CreateCustomer(c *gin.Context) {
	var input models.Customer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := services.CreateCustomer(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan customer: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Customer berhasil ditambahkan", "data": input})
}

// GetAllCustomers mengambil semua pelanggan
func GetAllCustomers(c *gin.Context) {
	customers, err := services.GetAllCustomers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data customer"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": customers})
}

// GetCustomerByID mengambil satu pelanggan berdasarkan ID
func GetCustomerByID(c *gin.Context) {
	id := c.Param("id")
	customer, err := services.GetCustomerByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": customer})
}

// UpdateCustomer memperbarui data pelanggan
func UpdateCustomer(c *gin.Context) {
	id := c.Param("id")
	var input models.Customer
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	customer, err := services.UpdateCustomer(id, &input)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Customer berhasil diupdate", "data": customer})
}

// DeleteCustomer menghapus pelanggan berdasarkan ID
func DeleteCustomer(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteCustomer(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Customer berhasil dihapus"})
}
