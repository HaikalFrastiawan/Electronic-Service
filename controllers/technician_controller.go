package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateTechnician adds a new technician.
func CreateTechnician(c *gin.Context) {
	var input models.Technician
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := services.CreateTechnician(&input); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save technician: " + err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Technician added successfully", "data": input})
}

// GetAllTechnicians retrieves all technicians.
func GetAllTechnicians(c *gin.Context) {
	technicians, err := services.GetAllTechnicians()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve technician data"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": technicians})
}

// GetTechnicianByID retrieves a single technician by ID.
func GetTechnicianByID(c *gin.Context) {
	id := c.Param("id")
	technician, err := services.GetTechnicianByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": technician})
}

// UpdateTechnician updates technician data.
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
	c.JSON(http.StatusOK, gin.H{"message": "Technician updated successfully", "data": technician})
}

// DeleteTechnician deletes a technician by ID.
func DeleteTechnician(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteTechnician(id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Technician deleted successfully"})
}
