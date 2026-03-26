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
// Customer Service Tests
// ========================

func TestCreateCustomer_Success(t *testing.T) {
	testhelper.CleanupTable("customers")

	customer := &models.Customer{
		Name:  "Budi Santoso",
		Phone: "08123456789",
		Email: "budi@test.com",
	}

	err := services.CreateCustomer(customer)
	assert.NoError(t, err)
	assert.NotZero(t, customer.ID, "ID seharusnya terisi setelah create")
}

func TestGetAllCustomers_ReturnsList(t *testing.T) {
	testhelper.CleanupTable("customers")

	services.CreateCustomer(&models.Customer{Name: "Andi", Phone: "1111"})
	services.CreateCustomer(&models.Customer{Name: "Budi", Phone: "2222"})

	customers, err := services.GetAllCustomers()
	assert.NoError(t, err)
	assert.Len(t, customers, 2, "Harus ada 2 customer")
}

func TestGetCustomerByID_Found(t *testing.T) {
	testhelper.CleanupTable("customers")

	c := &models.Customer{Name: "Citra", Phone: "3333"}
	services.CreateCustomer(c)

	found, err := services.GetCustomerByID(fmt.Sprint(c.ID))
	require.NoError(t, err)
	assert.Equal(t, "Citra", found.Name)
}

func TestGetCustomerByID_NotFound(t *testing.T) {
	testhelper.CleanupTable("customers")

	_, err := services.GetCustomerByID("99999")
	assert.Error(t, err)
	assert.Equal(t, "customer tidak ditemukan", err.Error())
}

func TestUpdateCustomer_Success(t *testing.T) {
	testhelper.CleanupTable("customers")

	c := &models.Customer{Name: "Dodi Lama", Phone: "4444"}
	services.CreateCustomer(c)

	updated, err := services.UpdateCustomer(fmt.Sprint(c.ID), &models.Customer{Name: "Dodi Baru"})
	require.NoError(t, err)
	assert.Equal(t, "Dodi Baru", updated.Name)
}

func TestDeleteCustomer_Success(t *testing.T) {
	testhelper.CleanupTable("customers")

	c := &models.Customer{Name: "Hapus Saya", Phone: "5555"}
	services.CreateCustomer(c)

	err := services.DeleteCustomer(fmt.Sprint(c.ID))
	assert.NoError(t, err)

	_, err = services.GetCustomerByID(fmt.Sprint(c.ID))
	assert.Error(t, err, "Customer sudah terhapus, harus error saat dicari")
}
