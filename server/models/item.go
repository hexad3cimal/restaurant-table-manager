package models

import (
	"table-booking/config"
	"table-booking/mappers"
	"time"

	uuid "github.com/twinj/uuid"
)

type ItemModel struct {
	ID          string    `db:"id, primarykey" json:"id"`
	OrgId       string    `db:"org_id" json:"orgId"`
	ItemName    string    `db:"item_name" json:"itemName"`
	Quantity    int       `db:"quantity" json:"quantity"`
	Price       float32   `db:"price" json:"price"`
	Discount    int       `db:"discount" json:"discount"`
	Description string    `db:"description" json:"description"`
	Image       string    `db:"image" json:"image"`
	UpdatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt   time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Item struct{}

func (item Item) Add(itemForm mappers.ItemForm) (itemModel ItemModel, err error) {

	itemModel.ID = uuid.NewV4().String()
	itemModel.ItemName = itemForm.ItemName
	itemModel.CreatedAt = time.Now()
	itemModel.OrgId = itemForm.OrgId
	itemModel.Quantity = itemForm.Quantity
	itemModel.Price = itemForm.Price
	itemModel.Discount = itemForm.Discount
	itemModel.Description = itemForm.Description
	itemModel.Image = itemForm.Image

	err = config.GetDB().Save(&itemModel).Error
	if err != nil {
		return ItemModel{}, err
	}

	return itemModel, err
}

func (item Item) Get(id string) (itemModel ItemModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&itemModel).Error
	if err != nil {

		return ItemModel{}, err
	}

	return itemModel, err
}

func (item Item) GetItemForOrg(ID string, orgId string) (itemModel ItemModel, err error) {

	err = config.GetDB().Where("ID=?", ID).Where("orgId=?", orgId).First(&itemModel).Error
	if err != nil {

		return ItemModel{}, err
	}

	return itemModel, err
}
