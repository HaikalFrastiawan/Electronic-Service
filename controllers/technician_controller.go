package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateTechnician menambah teknisi baru
func CreateTechnician(c *gin.Context) {
	var input models.Technician
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := services.CreateTechnician(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan teknisi: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Teknisi berhasil ditambahkan", "data": input})
}

// GetAllTechnicians mengambil semua teknisi
func GetAllTechnicians(c *gin.Context) {
	technicians, err := services.GetAllTechnicians()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data teknisi"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": technicians})
}

// GetTechnicianByID mengambil satu teknisi berdasarkan ID
func GetTechnicianByID(c *gin.Context) {
	id := c.Param("id")
	technician, err := services.GetTechnicianByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": technician})
}

// UpdateTechnician memperbarui data teknisi
func UpdateTechnician(c *gin.Context) {
	id := c.Param("id")
	var input models.Technician
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	technician, err := services.UpdateTechnician(id, &input)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Teknisi berhasil diupdate", "data": technician})
}

// DeleteTechnician menghapus teknisi berdasarkan ID
func DeleteTechnician(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteTechnician(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Teknisi berhasil dihapus"})
}
