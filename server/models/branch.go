package models

import (
	"errors"
	"table-booking/config"
	"time"
)

type BranchModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"orgId"`
	Name      string    `db:"name" json:"name"`
	Email     string    `db:"email" json:"email"`
	Address   string    `db:"address" json:"address"`
	Contact   string    `db:"contact" json:"contact"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	Orders    []Order
	Product   []Product
}

type Branch struct{}

// func (branch Branch) GetMostOrderedProducts(branchId string) (returnModel []ProductModel, err error) {
// 	err = config.GetDB().Table("product_models").Joins("joins order_models on product_models.branch_id = branch_models.ID").Where("product_models.branch_id = ?", branchId).Where("product_models.created_at BETWEEN ? AND ?", time.Now(), time.Now().AddDate(0, 0, -1)).Find(&returnModel).Error
// 	if err != nil {

// 		return []ProductModel{}, err
// 	}
// 	return returnModel, err
// }

func (branch Branch) Add(branchModel BranchModel) (returnModel BranchModel, err error) {

	if !config.GetDB().Where("name=?", branchModel.Name).Where("org_id=?", branchModel.OrgId).First(&branchModel).RecordNotFound() {

		return BranchModel{}, errors.New("branch name already taken")
	}

	err = config.GetDB().Save(&branchModel).Error
	if err != nil {
		return BranchModel{}, err
	}

	return branchModel, nil
}

func (branch Branch) Get(id string) (branchModel BranchModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&branchModel).Error
	if err != nil {

		return BranchModel{}, err
	}

	return branchModel, err
}

func (branch Branch) GetBranchesOfOrg(orgId string) (branches []BranchModel, err error) {

	err = config.GetDB().Where("org_id=?", orgId).Find(&branches).Error
	if err != nil {

		return []BranchModel{}, err
	}

	return branches, err
}

func (branch Branch) GetBrancheByOrgIdAndBranchName(orgId string, branchName string) (returnModel BranchModel, err error) {

	err = config.GetDB().Where("org_id=?", orgId).Where("name=?", branchName).First(&returnModel).Error
	if err != nil {

		return BranchModel{}, err
	}

	return returnModel, err
}

func (branch Branch) DeleteBranchById(branchId string) (branchModel BranchModel, err error) {

	err = config.GetDB().Where("id=?", branchId).Delete(&branchModel).Error
	if err != nil {

		return BranchModel{}, err
	}

	return branchModel, err
}
