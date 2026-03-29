package controllers

import (
	"booking-service/config"
	"booking-service/models"
	"booking-service/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateSparepart adds a new sparepart to the inventory.
func CreateSparepart(c *gin.Context) {
	var input models.Sparepart
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	if err := config.DB.Create(&input).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to create sparepart: "+err.Error())
		return
	}

	utils.JSONResponse(c, http.StatusCreated, "Sparepart created successfully", input)
}

// GetAllSpareparts returns all available spareparts.
func GetAllSpareparts(c *gin.Context) {
	var spareparts []models.Sparepart
	if err := config.DB.Find(&spareparts).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch spareparts: "+err.Error())
		return
	}

	utils.JSONResponse(c, http.StatusOK, "Spareparts retrieved", spareparts)
}

// GetSparepartByID returns a specific sparepart.
func GetSparepartByID(c *gin.Context) {
	id := c.Param("id")
	var sparepart models.Sparepart

	if err := config.DB.First(&sparepart, id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Sparepart not found")
		return
	}

	utils.JSONResponse(c, http.StatusOK, "Sparepart retrieved", sparepart)
}

// UpdateSparepart updates an existing sparepart.
func UpdateSparepart(c *gin.Context) {
	id := c.Param("id")
	var sparepart models.Sparepart

	if err := config.DB.First(&sparepart, id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Sparepart not found")
		return
	}

	var input models.Sparepart
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	config.DB.Model(&sparepart).Updates(input)

	utils.JSONResponse(c, http.StatusOK, "Sparepart updated successfully", sparepart)
}

// DeleteSparepart removes a sparepart from the inventory.
func DeleteSparepart(c *gin.Context) {
	id := c.Param("id")
	var sparepart models.Sparepart

	if err := config.DB.First(&sparepart, id).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "Sparepart not found")
		return
	}

	config.DB.Delete(&sparepart)
	utils.JSONResponse(c, http.StatusOK, "Sparepart deleted successfully", nil)
}
