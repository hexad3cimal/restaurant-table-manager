package mappers

type OrderForm struct {
	ProductName string `json:"productName" binding:"required"`
	ProductId   string `json:"productId" binding:"required"`
	Quantity    int32  `json:"quantity" binding:"required"`
	Notes       string `json:"notes"`
	TableId     string `json:"tableId" binding:"required"`
	Status      string `json:"status" binding:"required"`
}
