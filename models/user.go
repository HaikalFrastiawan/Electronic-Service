package models

import (
	"strings"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"type:varchar(100);not null" json:"name"`
	Email     string    `gorm:"type:varchar(100);uniqueIndex;not null" json:"email"`
	Password  string    `gorm:"type:varchar(255);not null" json:"-"`
	Role      string    `gorm:"type:varchar(20);default:'customer'" json:"role"` // admin | customer
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// BeforeSave is a GORM hook that runs before a User is saved (inserted or updated).
func (u *User) BeforeSave(tx *gorm.DB) (err error) {
	// Hash the password if it's not already hashed.
	// Bcrypt hashes start with $2a$, $2b$, or $2y$.
	if u.Password != "" && !strings.HasPrefix(u.Password, "$2a$") && !strings.HasPrefix(u.Password, "$2b$") && !strings.HasPrefix(u.Password, "$2y$") {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		u.Password = string(hashedPassword)
	}

	// Default role to customer if not specified
	if u.Role == "" {
		u.Role = "customer"
	}
	
	return nil
}
