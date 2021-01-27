package models

import (
	"table-booking/config"
	"time"
)

type OrderItemModel struct {
	ID             string                `db:"id, primarykey" json:"id"`
	OrgId          string                `db:"org_id" json:"orgId"`
	OrderId        string                `db:"order_id" json:"orderId"`
	BranchId       string                `db:"branch_id" json:"branchId"`
	BranchName     string                `db:"branch_name" json:"branchName"`
	Quantity       int32                 `db:"quantity" json:"quantity"`
	ProductName    string                `db:"product_name" json:"productName"`
	ProductId      string                `db:"product_id" json:"productId"`
	TableId        string                `db:"table_id" json:"tableId"`
	KitchenId      string                `db:"kitchen_id" json:"kitchenId"`
	KitchenName    string                `db:"kitchen_name" json:"kitchenName"`
	Status         string                `db:"status" json:"status"`
	Price          float32               `db:"price" json:"price"`
	Customisations []CustomisationsModel `gorm:"many2many:order_item_customisations;" json:"customisations"`
	UpdatedAt      time.Time             `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt      time.Time             `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type OrderItem struct{}

func (order OrderItem) Add(orderItemModel OrderItemModel) (returnModel OrderItemModel, err error) {

	err = config.GetDB().Save(&orderItemModel).Error
	if err != nil {
		return OrderItemModel{}, err
	}

	return orderItemModel, err
}

func (order OrderItem) Get(id string) (orderItemModel OrderItemModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&orderItemModel).Error
	if err != nil {

		return OrderItemModel{}, err
	}

	return orderItemModel, err
}

func (order OrderItem) GetByOrderId(orderId string) (orderItemModel []OrderItemModel) {

	config.GetDB().Where("order_id=?", orderId).Find(&orderItemModel)

	return orderItemModel
}

func (order OrderItem) DeleteById(ID string) (orderItemModel []OrderItemModel) {

	config.GetDB().Where("ID=?", ID).Delete(&orderItemModel)

	return orderItemModel
}

func (order OrderItem) DeleteByOrderId(orderId string) (orderItemModel []OrderItemModel) {

	config.GetDB().Where("order_id=?", orderId).Delete(&orderItemModel)

	return orderItemModel
}

func (order OrderItem) GetOrderForOrg(ID string, orgId string) (orderItemModel OrderItemModel, err error) {

	err = config.GetDB().Where("ID=?", ID).Where("org_id=?", orgId).Find(&orderItemModel).Error
	if err != nil {

		return OrderItemModel{}, err
	}

	return orderItemModel, err
}

func (order OrderItem) GetOrdersOfOrg(orgId string) (orderItemModels []OrderItemModel) {

	config.GetDB().Where("org_id=?", orgId).Find(&orderItemModels)

	return orderItemModels
}

func (order OrderItem) GetOrdersOfBranch(branchId string) (orderItemModels []OrderItemModel) {

	config.GetDB().Where("branch_id=?", branchId).Find(&orderItemModels)

	return orderItemModels
}
