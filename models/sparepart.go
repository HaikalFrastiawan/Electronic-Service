package models

import (
	"time"
)

type Sparepart struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"type:varchar(255);not null" json:"name" binding:"required"`
	Brand     string    `gorm:"type:varchar(100)" json:"brand"`
	Stock     int       `gorm:"not null;default:0" json:"stock" binding:"required,min=0"`
	Price     float64   `gorm:"not null;default:0" json:"price" binding:"required,min=0"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
