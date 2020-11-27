package models

import (
	"table-booking/config"
	"time"
)

type OrderModel struct {
	ID          string    `db:"id, primarykey" json:"id"`
	OrgId       string    `db:"org_id" json:"orgId"`
	TableId     string    `db:"table_id" json:"tableId"`
	BranchId    string    `db:"branch_id" json:"branchId"`
	BranchName  string    `db:"branch_name" json:"branchName"`
	Note        string    `db:"note" json:"note"`
	Quantity    int32     `db:"quantity" json:"quantity"`
	ProductId   string    `db:"product_id" json:"productId"`
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

func (order Order) GetOrderForOrg(ID string, orgId string) (orderModel OrderModel, err error) {

	err = config.GetDB().Where("ID=?", ID).Where("orgId=?", orgId).First(&orderModel).Error
	if err != nil {

		return OrderModel{}, err
	}

	return orderModel, err
}
