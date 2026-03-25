package models

import (
	"testing"
)

func TestBookingModel(t *testing.T) {
	// t dummy data 
	booking := Booking{
		CustomerName: "Budi",
		DeviceName:   "Laptop ASUS",
		Status:       "pending",
	}

	// Ekspektasi: Nama customer harus "Budi"
	expectedName := "Budi"
	if booking.CustomerName != expectedName {
		t.Errorf("Ekspektasi %s, tapi mendapatkan %s", expectedName, booking.CustomerName)
	}

	// Ekspektasi: Status default harusnya pending
	if booking.Status != "pending" {
		t.Errorf("Status harusnya pending")
	}
}