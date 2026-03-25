package models

import (
	"time"
)

type Booking struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	CustomerName     string    `gorm:"type:varchar(100);not null" json:"customer_name" binding:"required"`
	CustomerPhone    string    `gorm:"type:varchar(20);not null" json:"customer_phone" binding:"required"`
	DeviceName       string    `gorm:"type:varchar(100);not null" json:"device_name" binding:"required"`
	DeviceType       string    `gorm:"type:varchar(50)" json:"device_type"`
	IssueDescription string    `gorm:"type:text" json:"issue_description"`
	Status           string    `gorm:"type:varchar(20);default:'pending'" json:"status"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}