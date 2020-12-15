package models

import (
	"table-booking/config"
	"time"
)

type OrderModel struct {
	ID          string    `db:"id, primarykey" json:"id"`
	RefCode     string    `db:"ref_code" json:"refCode"`
	OrgId       string    `db:"org_id" json:"orgId"`
	TableId     string    `db:"table_id" json:"tableId"`
	BranchId    string    `db:"branch_id" json:"branchId"`
	BranchName  string    `db:"branch_name" json:"branchName"`
	Note        string    `db:"note" json:"note"`
	Quantity    int32     `db:"quantity" json:"quantity"`
	ProductId   string    `db:"product_id" json:"productId"`
	KitchenId   string    `db:"kitchen_id" json:"kitchenId"`
	KitchenName string    `db:"kitchen_name" json:"kitchenName"`
	ProductName string    `db:"product_name" json:"productName"`
	Status      string    `db:"status" json:"status"`
	UpdatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Order struct{}

func (order Order) Add(orderModel OrderModel) (returnModel OrderModel, err error) {

	err = config.GetDB().Save(&orderModel).Error
	if err != nil {
		return OrderModel{}, err
	}

	return orderModel, err
}

func (order Order) Get(id string) (orderModel OrderModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&orderModel).Error
	if err != nil {

		return OrderModel{}, err
	}

	return orderModel, err
}

func (order Order) GetByTableId(tableId string) (orderModel []OrderModel) {

	config.GetDB().Where("table_id=?", tableId).Where("status!=?", "complete").Find(&orderModel)

	return orderModel
}

func (order Order) DeleteById(tableId string) (orderModel []OrderModel) {

	config.GetDB().Where("ID=?", tableId).Delete(&orderModel)

	return orderModel
}

func (order Order) GetOrderForOrg(ID string, orgId string) (orderModel OrderModel, err error) {

	err = config.GetDB().Where("ID=?", ID).Where("org_id=?", orgId).Find(&orderModel).Error
	if err != nil {

		return OrderModel{}, err
	}

	return orderModel, err
}

func (order Order) GetOrdersOfOrg(orgId string) (orderModels []OrderModel) {

	config.GetDB().Where("org_id=?", orgId).Find(&orderModels)

	return orderModels
}

func (order Order) GetOrdersOfBranch(branchId string) (orderModels []OrderModel) {

	config.GetDB().Where("branch_id=?", branchId).Find(&orderModels)

	return orderModels
}
