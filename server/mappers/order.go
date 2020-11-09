package mappers

type OrderForm struct {
	ItemName string `json:"itemName" binding:"required"`
	OrgId    string `json:"orgId" binding:"required"`
	ItemId   string `json:"itemId" binding:"required"`
	TableId  string `json:"tableId" binding:"required"`
}
