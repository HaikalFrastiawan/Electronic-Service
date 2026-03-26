package services_test

import (
	"booking-service/models"
	"booking-service/services"
	"booking-service/testhelper"
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func init() {
	testhelper.SetupTestDB()
}

// ========================
// Technician Service Tests
// ========================

func TestCreateTechnician_Success(t *testing.T) {
	testhelper.CleanupTable("technicians")

	tech := &models.Technician{
		Name:      "Andi Teknisi",
		Phone:     "08199911",
		Specialty: "Laptop & PC",
	}

	err := services.CreateTechnician(tech)
	assert.NoError(t, err)
	assert.NotZero(t, tech.ID, "ID seharusnya terisi setelah create")
}

func TestGetAllTechnicians_ReturnsList(t *testing.T) {
	testhelper.CleanupTable("technicians")

	services.CreateTechnician(&models.Technician{Name: "Teknisi A", Phone: "001", Specialty: "HP"})
	services.CreateTechnician(&models.Technician{Name: "Teknisi B", Phone: "002", Specialty: "AC"})

	technicians, err := services.GetAllTechnicians()
	assert.NoError(t, err)
	assert.Len(t, technicians, 2)
}

func TestGetTechnicianByID_Found(t *testing.T) {
	testhelper.CleanupTable("technicians")

	tech := &models.Technician{Name: "Beni", Phone: "009", Specialty: "TV"}
	services.CreateTechnician(tech)

	found, err := services.GetTechnicianByID(fmt.Sprint(tech.ID))
	require.NoError(t, err)
	assert.Equal(t, "Beni", found.Name)
}

func TestGetTechnicianByID_NotFound(t *testing.T) {
	testhelper.CleanupTable("technicians")

	_, err := services.GetTechnicianByID("88888")
	assert.Error(t, err)
	assert.Equal(t, "teknisi tidak ditemukan", err.Error())
}

func TestUpdateTechnician_Success(t *testing.T) {
	testhelper.CleanupTable("technicians")

	tech := &models.Technician{Name: "Candra Lama", Phone: "007", Specialty: "Printer"}
	services.CreateTechnician(tech)

	updated, err := services.UpdateTechnician(fmt.Sprint(tech.ID), &models.Technician{Name: "Candra Baru"})
	require.NoError(t, err)
	assert.Equal(t, "Candra Baru", updated.Name)
}

func TestDeleteTechnician_Success(t *testing.T) {
	testhelper.CleanupTable("technicians")

	tech := &models.Technician{Name: "Dimas Hapus", Phone: "008", Specialty: "Kulkas"}
	services.CreateTechnician(tech)

	err := services.DeleteTechnician(fmt.Sprint(tech.ID))
	assert.NoError(t, err)

	_, err = services.GetTechnicianByID(fmt.Sprint(tech.ID))
	assert.Error(t, err)
}
