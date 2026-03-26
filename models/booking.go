package models

import "time"

type Booking struct {
	ID               uint        `gorm:"primaryKey" json:"id"`
	CustomerID       uint        `gorm:"not null" json:"customer_id" binding:"required"`
	Customer         Customer    `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	TechnicianID     *uint       `json:"technician_id"`
	Technician       *Technician `gorm:"foreignKey:TechnicianID" json:"technician,omitempty"`
	DeviceName       string      `gorm:"type:varchar(100);not null" json:"device_name" binding:"required"`
	DeviceType       string      `gorm:"type:varchar(50)" json:"device_type"`
	IssueDescription string      `gorm:"type:text" json:"issue_description"`
	EstimatedCost    float64     `gorm:"default:0" json:"estimated_cost"`
	Notes            string      `gorm:"type:text" json:"notes"`
	Status           string      `gorm:"type:varchar(20);default:'pending'" json:"status"` // pending | in_progress | done | cancelled
	CreatedAt        time.Time   `json:"created_at"`
	UpdatedAt        time.Time   `json:"updated_at"`
}