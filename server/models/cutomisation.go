package models

import (
	"table-booking/config"
	"time"
)

type CustomisationModel struct {
	ID             string           `db:"id, primarykey" json:"id"`
	ProductId      string           `db:"product_id" json:"productId`
	OrderId        string           `db:"order_id" json:"orderId`
	Description    string           `db:"description" json:"description"`
	Image          string           `db:"image" json:"image"`
	Active         bool             `db:"active" json:"-" sql:"DEFAULT:true"`
	Name           string           `db:"name" json:"name"`
	UpdatedAt      time.Time        `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt      time.Time        `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	Customisations []Customisations `json:"customisations"`
}

type Customisation struct{}

func (category Customisation) Add(customisationModel CustomisationModel) (returnModel CustomisationModel, err error) {

	err = config.GetDB().Save(&customisationModel).Error
	if err != nil {
		return CustomisationModel{}, err
	}

	return customisationModel, err
}

func (category Customisation) DeleteById(id string) (returnModel CustomisationModel, err error) {

	err = config.GetDB().Where("id=?", id).Delete(&returnModel).Error

	if err != nil {
		return CustomisationModel{}, err
	}

	return returnModel, err
}

func (category Customisation) Get(id string) (customisationModel CustomisationModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&customisationModel).Error
	if err != nil {

		return CustomisationModel{}, err
	}

	return customisationModel, err
}

func (category Customisation) GetByProductId(productId string) (customisationModels []CustomisationModel, err error) {

	err = config.GetDB().Where("product_id=?", productId).Find(&customisationModels).Error
	if err != nil {

		return []CustomisationModel{}, err
	}

	return customisationModels, err
}

func (category Customisation) GetByOrderId(orderId string) (customisationModel CustomisationModel, err error) {

	err = config.GetDB().Where("order_id=?", orderId).First(&customisationModel).Error
	if err != nil {

		return CustomisationModel{}, err
	}

	return customisationModel, err
}
