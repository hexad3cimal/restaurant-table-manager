package models

import (
	"table-booking/config"
	"table-booking/mappers"
	"time"

	uuid "github.com/twinj/uuid"
)

type OrderModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"orgId"`
	TableId   string    `db:"table_id" json:"tableId"`
	ItemId    string    `db:"item_id" json:"itemId"`
	ItemName  string    `db:"item_name" json:"itemName"`
	Status    string    `db:"status" json:"status"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Order struct{}

func (order Order) Add(orderForm mappers.OrderForm) (orderModel OrderModel, err error) {

	orderModel.Status = "ordered"
	orderModel.ID = uuid.NewV4().String()
	orderModel.ItemName = orderForm.ItemName
	orderModel.CreatedAt = time.Now()
	orderModel.OrgId = orderForm.OrgId
	orderModel.TableId = orderForm.TableId
	orderModel.ItemId = orderForm.ItemId

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
