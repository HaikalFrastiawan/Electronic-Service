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

// seedCustomer helper: buat customer dummy, return ID-nya
func seedCustomer(name, phone string) uint {
	c := &models.Customer{Name: name, Phone: phone}
	services.CreateCustomer(c)
	return c.ID
}

// ========================
// Booking Service Tests
// ========================

func TestCreateBooking_Success(t *testing.T) {
	testhelper.CleanupTable("bookings")
	testhelper.CleanupTable("customers")

	custID := seedCustomer("Pelanggan Test", "0812345")

	booking := &models.Booking{
		CustomerID: custID,
		DeviceName: "Laptop Rusak",
		DeviceType: "Laptop",
	}

	err := services.CreateBooking(booking)
	assert.NoError(t, err)
	assert.NotZero(t, booking.ID)
	assert.Equal(t, "Laptop Rusak", booking.DeviceName)
}

func TestCreateBooking_CustomerNotFound(t *testing.T) {
	testhelper.CleanupTable("bookings")
	testhelper.CleanupTable("customers")

	booking := &models.Booking{
		CustomerID: 99999, // ID tidak ada
		DeviceName: "HP Rusak",
	}

	err := services.CreateBooking(booking)
	assert.Error(t, err)
	assert.Equal(t, "customer not found", err.Error())
}

func TestGetAllBookings_ReturnsList(t *testing.T) {
	testhelper.CleanupTable("bookings")
	testhelper.CleanupTable("customers")

	custID := seedCustomer("Pelanggan List", "0899")

	services.CreateBooking(&models.Booking{CustomerID: custID, DeviceName: "TV 1"})
	services.CreateBooking(&models.Booking{CustomerID: custID, DeviceName: "TV 2"})

	bookings, err := services.GetAllBookings()
	assert.NoError(t, err)
	assert.Len(t, bookings, 2)
}

func TestGetBookingByID_Found(t *testing.T) {
	testhelper.CleanupTable("bookings")
	testhelper.CleanupTable("customers")

	custID := seedCustomer("Pelanggan Detail", "0800")
	b := &models.Booking{CustomerID: custID, DeviceName: "Kulkas"}
	services.CreateBooking(b)

	found, err := services.GetBookingByID(fmt.Sprint(b.ID))
	require.NoError(t, err)
	assert.Equal(t, "Kulkas", found.DeviceName)
}

func TestGetBookingByID_NotFound(t *testing.T) {
	testhelper.CleanupTable("bookings")

	_, err := services.GetBookingByID("77777")
	assert.Error(t, err)
	assert.Equal(t, "booking not found", err.Error())
}

func TestUpdateBookingStatus_ValidStatus(t *testing.T) {
	testhelper.CleanupTable("bookings")
	testhelper.CleanupTable("customers")

	custID := seedCustomer("Pelanggan Status", "0777")
	b := &models.Booking{CustomerID: custID, DeviceName: "Mesin Cuci"}
	services.CreateBooking(b)

	updated, err := services.UpdateBookingStatus(fmt.Sprint(b.ID), "In Repair", nil)
	require.NoError(t, err)
	assert.Equal(t, "In Repair", updated.Status)
}

func TestUpdateBookingStatus_InvalidStatus(t *testing.T) {
	testhelper.CleanupTable("bookings")
	testhelper.CleanupTable("customers")

	custID := seedCustomer("Pelanggan Status2", "0666")
	b := &models.Booking{CustomerID: custID, DeviceName: "Setrika"}
	services.CreateBooking(b)

	_, err := services.UpdateBookingStatus(fmt.Sprint(b.ID), "InvalidStatus", nil)
	assert.Error(t, err)
	assert.Contains(t, err.Error(), "invalid status")
}

func TestDeleteBooking_Success(t *testing.T) {
	testhelper.CleanupTable("bookings")
	testhelper.CleanupTable("customers")

	custID := seedCustomer("Pelanggan Del", "0555")
	b := &models.Booking{CustomerID: custID, DeviceName: "Kompor"}
	services.CreateBooking(b)

	err := services.DeleteBooking(fmt.Sprint(b.ID))
	assert.NoError(t, err)

	_, err = services.GetBookingByID(fmt.Sprint(b.ID))
	assert.Error(t, err)
}
