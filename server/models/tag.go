package models

import (
	"table-booking/config"
	"time"
)

type TagModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"org_id"`
	BranchId  string    `db:"branch_id" json:"branch_id"`
	ProductId string    `db:"product_id" json:"product_id"`
	Active    bool      `db:"active" json:"-" sql:"DEFAULT:true"`
	Name      string    `db:"name" json:"name"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Tag struct{}

func (tag Tag) Add(tagModel TagModel) (returnModel TagModel, err error) {

	err = config.GetDB().Save(&tagModel).Error
	if err != nil {
		return TagModel{}, err
	}

	return tagModel, err
}

func (tag Tag) DeleteById(id string) (returnModel TagModel, err error) {

	err = config.GetDB().Where("id=?", id).Delete(&returnModel).Error

	if err != nil {
		return TagModel{}, err
	}

	return returnModel, err
}

func (tag Tag) Get(id string) (tagModel TagModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&tagModel).Error
	if err != nil {

		return TagModel{}, err
	}

	return tagModel, err
}

func (tag Tag) GetByNameAndOrgId(tagName string, orgId string) (tagModel TagModel, err error) {

	err = config.GetDB().Where("name=?", tagName).Where("org_id=?", orgId).First(&tagModel).Error
	if err != nil {

		return TagModel{}, err
	}

	return tagModel, err
}

func (tag Tag) GetByIdAndOrg(tagId string, orgId string) (tagModel TagModel, err error) {

	err = config.GetDB().Where("id=?", tagId).Where("org_id=?", orgId).First(&tagModel).Error
	if err != nil {

		return TagModel{}, err
	}

	return tagModel, err
}

func (tag Tag) GetByOrgId(orgId string) (tagModels []TagModel, err error) {

	err = config.GetDB().Where("org_id=?", orgId).Find(&tagModels).Error
	if err != nil {

		return []TagModel{}, err
	}

	return tagModels, err
}

func (tag Tag) GetByBranchId(branchId string) (tagModels []TagModel, err error) {

	err = config.GetDB().Where("branch_id=?", branchId).Find(&tagModels).Error
	if err != nil {

		return []TagModel{}, err
	}

	return tagModels, err
}
