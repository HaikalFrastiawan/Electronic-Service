package models

import (
	"time"

	"gorm.io/gorm"
)

type Customer struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"type:varchar(100);not null" json:"name" binding:"required"`
	Phone     string    `gorm:"type:varchar(20);not null" json:"phone" binding:"required"`
	Email     *string   `gorm:"type:varchar(100);uniqueIndex" json:"email"`
	Address   string    `gorm:"type:text" json:"address"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (c *Customer) BeforeSave(tx *gorm.DB) (err error) {
	if c.Email != nil && *c.Email == "" {
		c.Email = nil
	}
	return nil
}
