package models

import (
	"table-booking/config"
	"time"
)

type CustomisationsModel struct {
	ID              string    `db:"id, primarykey" json:"id"`
	CustomisationId string    `db:"customisation_id`
	Description     string    `db:"description" json:"description"`
	Price           string    `db:"price" json:"price"`
	Image           string    `db:"image" json:"image"`
	Active          bool      `db:"active" json:"-" sql:"DEFAULT:true"`
	Name            string    `db:"name" json:"name"`
	UpdatedAt       time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt       time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Customisations struct{}

func (category Customisations) Add(customisationsModel CustomisationsModel) (returnModel CustomisationsModel, err error) {

	err = config.GetDB().Save(&customisationsModel).Error
	if err != nil {
		return CustomisationsModel{}, err
	}

	return customisationsModel, err
}

func (category Customisations) DeleteById(id string) (returnModel CustomisationsModel, err error) {

	err = config.GetDB().Where("id=?", id).Delete(&returnModel).Error

	if err != nil {
		return CustomisationsModel{}, err
	}

	return returnModel, err
}

func (category Customisations) Get(id string) (customisationsModel CustomisationsModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&customisationsModel).Error
	if err != nil {

		return CustomisationsModel{}, err
	}

	return customisationsModel, err
}

func (category Customisations) GetByCustomisationId(customisationId string) (customisationsModels []CustomisationsModel, err error) {

	err = config.GetDB().Where("customisation_id=?", customisationId).Find(&customisationsModels).Error
	if err != nil {

		return []CustomisationsModel{}, err
	}

	return customisationsModels, err
}
