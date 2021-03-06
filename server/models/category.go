package models

import (
	"table-booking/config"
	"time"
)

type CategoryModel struct {
	ID          string    `db:"id, primarykey" json:"id"`
	OrgId       string    `db:"org_id" json:"org_id"`
	BranchId    string    `db:"branch_id" json:"branch_id"`
	Description string    `db:"description" json:"description"`
	Image       string    `db:"image" json:"image"`
	Active      bool      `db:"active" json:"-" sql:"DEFAULT:true"`
	Name        string    `db:"name" json:"name"`
	UpdatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Category struct{}

func (category Category) Add(categoryModel CategoryModel) (returnModel CategoryModel, err error) {

	err = config.GetDB().Save(&categoryModel).Error
	if err != nil {
		return CategoryModel{}, err
	}

	return categoryModel, err
}

func (category Category) DeleteById(id string) (returnModel CategoryModel, err error) {

	err = config.GetDB().Where("id=?", id).Delete(&returnModel).Error

	if err != nil {
		return CategoryModel{}, err
	}

	return returnModel, err
}

func (category Category) DeleteByBranchId(branchId string) (returnModel CategoryModel, err error) {

	err = config.GetDB().Where("branch_id=?", branchId).Delete(&returnModel).Error

	if err != nil {
		return CategoryModel{}, err
	}

	return returnModel, err
}

func (category Category) Get(id string) (categoryModel CategoryModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&categoryModel).Error
	if err != nil {

		return CategoryModel{}, err
	}

	return categoryModel, err
}

func (category Category) GetCategoryByNameAndOrgId(categoryName string, orgId string) (categoryModel CategoryModel, err error) {

	err = config.GetDB().Where("name=?", categoryName).Where("org_id=?", orgId).First(&categoryModel).Error
	if err != nil {

		return CategoryModel{}, err
	}

	return categoryModel, err
}

func (category Category) GetCategoryByIdAndOrg(categoryId string, orgId string) (categoryModel CategoryModel, err error) {

	err = config.GetDB().Where("id=?", categoryId).Where("org_id=?", orgId).First(&categoryModel).Error
	if err != nil {

		return CategoryModel{}, err
	}

	return categoryModel, err
}

func (category Category) GetByOrgId(orgId string) (categoryModels []CategoryModel, err error) {

	err = config.GetDB().Where("org_id=?", orgId).Find(&categoryModels).Error
	if err != nil {

		return []CategoryModel{}, err
	}

	return categoryModels, err
}

func (category Category) GetByBranchId(branchId string) (categoryModels []CategoryModel, err error) {

	err = config.GetDB().Where("branch_id=?", branchId).Find(&categoryModels).Error
	if err != nil {

		return []CategoryModel{}, err
	}

	return categoryModels, err
}
