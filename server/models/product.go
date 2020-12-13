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
	KitchenId   string    `db:"kitchen_id" json:"kitchenId"`
	KitchenName string    `db:"kitchen_name" json:"kitchenName"`
	Name        string    `db:"name" json:"name"`
	Quantity    int       `db:"quantity" json:"quantity"`
	Price       string    `db:"price" json:"price"`
	Discount    int       `db:"discount" json:"discount"`
	Description string    `db:"description" json:"description"`
	Image       string    `db:"image" json:"image"`
	Highlight   bool      `db:"highlight" json:"highlight"`
	Active      bool      `db:"active" json:"active" sql:"DEFAULT:true"`
	UpdatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt   time.Time `db:"created_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Product struct{}

func (product Product) Add(productModel ProductModel) (returnModel ProductModel, err error) {

	err = config.GetDB().Save(&productModel).Error
	if err != nil {
		return ProductModel{}, err
	}

	return productModel, err
}

func (product Product) GetMostOrderedProductsOfBranch(branchId string) (returnModel []ProductModel, err error) {

	//err = config.GetDB().Limit(10).Table("product_models").Select("product_models.*,count(product_models.id) as productCount").Joins("join order_models on product_models.id = order_models.product_id").Where("product_models.branch_id = ?", branchId).Group("product_models.id").Find(&returnModel).Error
	err = config.GetDB().Raw("SELECT product_models.*,count(product_models.id) as productCount 	FROM product_models join order_models on product_models.id = order_models.product_id WHERE product_models.branch_id = ? GROUP BY product_models.id ORDER BY productCount desc LIMIT 10", branchId).Find(&returnModel).Error
	if err != nil {

		return []ProductModel{}, err
	}
	return returnModel, err
}
func (product Product) GetRecentlyOrderedProductsOfBranch(branchId string) (returnModel []ProductModel, err error) {

	err = config.GetDB().Limit(10).Table("product_models").Joins("join order_models on product_models.id =  order_models.product_id").Where("product_models.branch_id = ?", branchId).Where("order_models.created_at BETWEEN ? AND ?", time.Now(), time.Now().AddDate(0, 0, -1)).Order("order_models.created_at").Find(&returnModel).Error
	if err != nil {

		return []ProductModel{}, err
	}
	return returnModel, err
}

func (product Product) GetById(id string) (productModel ProductModel, err error) {

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
