package models

import (
	"errors"
	"table-booking/config"
	"time"
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

func (org Organization) Add(organization OrganizationModel) (returnObject OrganizationModel, err error) {

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

func (org Organization) DeleteById(id string) (organization OrganizationModel, err error) {

	err = config.GetDB().Where("id=?", id).Delete(&organization).Error
	if err != nil {

		return OrganizationModel{}, err
	}

	return organization, err
}

func (org Organization) GetByEmail(email string) (organization OrganizationModel, err error) {

	if !config.GetDB().Where("email=?", email).First(&organization).RecordNotFound() {

		return OrganizationModel{}, errors.New("email already taken")
	}
	return organization, nil
}

func (org Organization) GetByCode(code string) (organization OrganizationModel, err error) {

	err = config.GetDB().Where("code=?", code).First(&organization).Error
	if err != nil {

		return OrganizationModel{}, err
	}

	return organization, err
}
