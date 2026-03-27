package models

import (
	"crypto/rand"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Booking struct {
	ID               uint        `gorm:"primaryKey" json:"id"`
	TrackingID       string      `gorm:"type:varchar(50);uniqueIndex" json:"tracking_id"`
	CustomerID       uint        `gorm:"not null" json:"customer_id" binding:"required"`
	Customer         Customer    `gorm:"foreignKey:CustomerID" json:"customer,omitempty"`
	TechnicianID     *uint       `json:"technician_id"`
	Technician       *Technician `gorm:"foreignKey:TechnicianID" json:"technician,omitempty"`
	DeviceName       string      `gorm:"type:varchar(100);not null" json:"device_name" binding:"required"`
	DeviceType       string      `gorm:"type:varchar(50)" json:"device_type"`
	IssueDescription string      `gorm:"type:text" json:"issue_description"`
	EstimatedCost    float64     `gorm:"default:0" json:"estimated_cost"`
	Notes            string      `gorm:"type:text" json:"notes"`
	Status           string      `gorm:"type:varchar(20);default:'Pending'" json:"status"` // Pending | In_Progress | Completed | Cancelled
	CreatedAt        time.Time   `json:"created_at"`
	UpdatedAt        time.Time   `json:"updated_at"`
}

// BeforeCreate is a GORM hook to generate a unique tracking ID
func (b *Booking) BeforeCreate(tx *gorm.DB) (err error) {
	b.TrackingID = generateTrackingID()
	return
}

func generateTrackingID() string {
	b := make([]byte, 4)
	rand.Read(b)
	return fmt.Sprintf("ES-%X-%d", b, time.Now().Unix()%100000)
}