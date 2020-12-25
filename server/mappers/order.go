package mappers

type Product struct {
	ProductId   string `json:"productId" binding:"required"`
	ProductName string `json:"productName" binding:"required"`
	Notes       string `json:"notes"`
}

type OrderForm struct {
	Products []Product `json:"products" binding:"required"`
	TableId  string    `json:"tableId" binding:"required"`
	Status   string    `json:"status" binding:"required"`
}
