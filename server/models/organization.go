package models

import (
	"table-booking/config"
	"table-booking/mappers"
	"time"

	uuid "github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type OrganizationModel struct {
	ID                 string    `db:"id, primarykey" json:"id"`
	Code               string    `db:"code" json:"code"`
	Email              string    `db:"email" json:"email"`
	Password           []byte    `db:"password" json:"-"`
	ForgotPasswordCode string    `db:"forgot_password" json:"-"`
	Active             bool      `db:"active" json:"-"`
	Locked             bool      `db:"locked" json:"-"`
	LockedUntil        time.Time `db:"locked_until" json:"-"`
	Name               string    `db:"name" json:"name"`
	UpdatedAt          time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt          time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
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
	organization.Code = uuid.NewV4().String()
	err = config.GetDB().Save(&organization).Error
	if err != nil {
		return OrganizationModel{}, err
	}

	return organization, err
}

func (org Organization) Get(id string) (organization OrganizationModel, err error) {

	err = config.GetDB().Where("WHERE id=LOWER($1) LIMIT 1", id).First(&organization).Error
	if err != nil {

		return OrganizationModel{}, err
	}

	return organization, err
}

func (org Organization) GetByCode(code string) (organization OrganizationModel, err error) {

	err = config.GetDB().Where("WHERE code=LOWER($1) LIMIT 1", code).First(&organization).Error
	if err != nil {

		return OrganizationModel{}, err
	}

	return organization, err
}
