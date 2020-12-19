package models

import (
	"table-booking/config"
	"time"
)

type FoodTypeModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"org_id"`
	BranchId  string    `db:"branch_id" json:"branch_id"`
	Active    bool      `db:"active" json:"-" sql:"DEFAULT:true"`
	Name      string    `db:"name" json:"name"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type FoodType struct{}

func (foodType FoodType) Add(foodTypeModel FoodTypeModel) (returnModel FoodTypeModel, err error) {

	err = config.GetDB().Save(&foodTypeModel).Error
	if err != nil {
		return FoodTypeModel{}, err
	}

	return foodTypeModel, err
}

func (foodType FoodType) DeleteById(id string) (returnModel FoodTypeModel, err error) {

	err = config.GetDB().Where("id=?", id).Delete(&returnModel).Error

	if err != nil {
		return FoodTypeModel{}, err
	}

	return returnModel, err
}

func (foodType FoodType) Get(id string) (foodTypeModel FoodTypeModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&foodTypeModel).Error
	if err != nil {

		return FoodTypeModel{}, err
	}

	return foodTypeModel, err
}

func (foodType FoodType) GetFoodTypeByNameAndOrgId(foodTypeName string, orgId string) (foodTypeModel FoodTypeModel, err error) {

	err = config.GetDB().Where("name=?", foodTypeName).Where("org_id=?", orgId).First(&foodTypeModel).Error
	if err != nil {

		return FoodTypeModel{}, err
	}

	return foodTypeModel, err
}

func (foodType FoodType) GetFoodTypeByIdAndOrg(foodTypeId string, orgId string) (foodTypeModel FoodTypeModel, err error) {

	err = config.GetDB().Where("id=?", foodTypeId).Where("org_id=?", orgId).First(&foodTypeModel).Error
	if err != nil {

		return FoodTypeModel{}, err
	}

	return foodTypeModel, err
}
