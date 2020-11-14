package models

import (
	"errors"
	"table-booking/config"
	"table-booking/mappers"
	"time"

	uuid "github.com/twinj/uuid"
)

type OrganizationModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	Name      string    `db:"name" json:"name"`
	Email     string    `db:"email" json:"email"`
	Address   string    `db:"name" json:"address"`
	Contact   string    `db:"contact" json:"contact"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Organization struct{}

func (org Organization) Add(form mappers.RegisterForm) (organization OrganizationModel, err error) {

	if !config.GetDB().Where("email=?", form.Email).First(&organization).RecordNotFound() {

		return OrganizationModel{}, errors.New("email already taken")
	}

	organization.Name = form.FullName
	organization.Email = form.Email
	organization.Address = form.Address
	organization.Contact = form.Contact

	organization.ID = uuid.NewV4().String()
	err = config.GetDB().Save(&organization).Error
	if err != nil {
		return OrganizationModel{}, err
	}

	return organization, err
}

func (org Organization) Get(id string) (organization OrganizationModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&organization).Error
	if err != nil {

		return OrganizationModel{}, err
	}

	return organization, err
}

func (org Organization) GetByCode(code string) (organization OrganizationModel, err error) {

	err = config.GetDB().Where("code=?", code).First(&organization).Error
	if err != nil {

		return OrganizationModel{}, err
	}

	return organization, err
}
