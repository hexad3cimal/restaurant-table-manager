package models

import (
	"table-booking/config"
	"time"
)

type ProductModel struct {
	ID          string    `db:"id, primarykey" json:"id"`
	OrgId       string    `db:"org_id" json:"orgId"`
	BranchId    string    `db:"branch_id" json:"branchId"`
	BranchName  string    `db:"branch_name" json:"branchName"`
	Name        string    `db:"name" json:"name"`
	Quantity    int       `db:"quantity" json:"quantity"`
	Price       string    `db:"price" json:"price"`
	Discount    int       `db:"discount" json:"discount"`
	Description string    `db:"description" json:"description"`
	Image       string    `db:"image" json:"image"`
	UpdatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Product struct{}

func (product Product) Add(productModel ProductModel) (returnModel ProductModel, err error) {

	err = config.GetDB().Save(&productModel).Error
	if err != nil {
		return ProductModel{}, err
	}

	return productModel, err
}

func (product Product) Get(id string) (productModel ProductModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&productModel).Error
	if err != nil {

		return ProductModel{}, err
	}

	return productModel, err
}

func (product Product) GetProductForOrg(ID string, orgId string) (productModel ProductModel, err error) {

	err = config.GetDB().Where("ID=?", ID).Where("orgId=?", orgId).First(&productModel).Error
	if err != nil {

		return ProductModel{}, err
	}

	return productModel, err
}

func (product Product) GetProductsOfBranch(branchId string) (productModels []ProductModel, err error) {

	err = config.GetDB().Where("branch_id=?", branchId).Find(&productModels).Error
	if err != nil {

		return []ProductModel{}, err
	}

	return productModels, err
}

func (product Product) GetProductsOfOrg(orgId string) (productModels []ProductModel, err error) {

	err = config.GetDB().Where("org_id=?", orgId).Find(&productModels).Error
	if err != nil {

		return []ProductModel{}, err
	}

	return productModels, err
}
