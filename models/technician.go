package models

import "time"

type Technician struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"type:varchar(100);not null" json:"name" binding:"required"`
	Phone       string    `gorm:"type:varchar(20);not null" json:"phone" binding:"required"`
	Specialty   string    `gorm:"type:varchar(100)" json:"specialty"`
	IsAvailable bool      `gorm:"default:true" json:"is_available"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
