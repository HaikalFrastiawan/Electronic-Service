package controllers

import (
	"booking-service/models"
	"booking-service/services"
	"booking-service/utils"
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
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to save technician")
		return
	}
	utils.JSONResponse(c, http.StatusCreated, "Technician added successfully", input)
}

// GetAllTechnicians retrieves all technicians.
func GetAllTechnicians(c *gin.Context) {
	technicians, err := services.GetAllTechnicians()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to retrieve technician data")
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Technicians retrieved", technicians)
}

// GetTechnicianByID retrieves a single technician by ID.
func GetTechnicianByID(c *gin.Context) {
	id := c.Param("id")
	technician, err := services.GetTechnicianByID(id)
	if err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Technician found", technician)
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
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Technician updated successfully", technician)
}

// DeleteTechnician deletes a technician by ID.
func DeleteTechnician(c *gin.Context) {
	id := c.Param("id")
	if err := services.DeleteTechnician(id); err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, err.Error())
		return
	}
	utils.JSONResponse(c, http.StatusOK, "Technician deleted successfully", nil)
}
