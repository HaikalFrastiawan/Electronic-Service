package models

import (
	"errors"
	"time"

	"gorm.io/gorm"
)

type BookingItem struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	BookingID   uint      `gorm:"not null" json:"booking_id" binding:"required"`
	SparepartID uint      `gorm:"not null" json:"sparepart_id" binding:"required"`
	Sparepart   Sparepart `gorm:"foreignKey:SparepartID" json:"sparepart,omitempty"`
	Quantity    int       `gorm:"not null;default:1" json:"quantity" binding:"required,min=1"`
	Price       float64   `gorm:"not null" json:"price"` // Captured price at the exact moment of billing
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// AfterCreate is a GORM hook that decrements the sparepart stock in a transaction
// and optionally adds to the Booking estimated cost.
func (bi *BookingItem) AfterCreate(tx *gorm.DB) (err error) {
	var sparepart Sparepart
	if err := tx.First(&sparepart, bi.SparepartID).Error; err != nil {
		return err
	}

	if sparepart.Stock < bi.Quantity {
		return errors.New("insufficient stock for sparepart")
	}

	// Decrement the stock
	if err := tx.Model(&sparepart).Update("stock", gorm.Expr("stock - ?", bi.Quantity)).Error; err != nil {
		return err
	}

	// Calculate total addition for the booking
	totalCost := float64(bi.Quantity) * bi.Price

	// Update the Booking's EstimatedCost
	if err := tx.Exec("UPDATE bookings SET estimated_cost = estimated_cost + ? WHERE id = ?", totalCost, bi.BookingID).Error; err != nil {
		return err
	}

	return nil
}
