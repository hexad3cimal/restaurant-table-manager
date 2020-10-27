package models

import (
	"gin-starter/config"
	"gin-starter/mappers"
	"time"

	uuid "github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type OrganizationModel struct {
	ID                 string    `db:"id, primarykey" json:"id"`
	Email              string    `db:"email" json:"email"`
	Password           []byte    `db:"password" json:"-"`
	ForgotPasswordCode string    `db:"forgot_password" json:"-"`
	Active             bool      `db:"active" json:"-"`
	Locked             bool      `db:"locked" json:"-"`
	LockedUntil        time.Time `db:"locked_until" json:"-"`
	Name               string    `db:"name" json:"name"`
	UpdatedAt          int64     `db:"updated_at" json:"-"`
	CreatedAt          int64     `db:"created_at" json:"-"`
}

type Organization struct{}

func (org Organization) Add(form mappers.RegisterForm) (organization OrganizationModel, err error) {

	err = config.GetDB().Where("WHERE email=LOWER($1) LIMIT 1", form.Email).First(&organization).Error
	if err != nil {

		return OrganizationModel{}, err
	}

	bytePassword := []byte(form.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	organization.Name = form.FullName
	organization.Email = form.Email
	organization.Password = hashedPassword
	organization.ForgotPasswordCode = uuid.NewV4().String()
	err = config.GetDB().Save(&organization).Error
	if err != nil {
		return OrganizationModel{}, err
	}

	return organization, err
}
