package mappers

type ProductForm struct {
	ProductName string  `json:"itemName" binding:"required"`
	OrgId       string  `json:"orgId"`
	BranchId    string  `json:"branchId" binding:"required"`
	Description string  `json:"decription" binding:"required"`
	Image       string  `json:"image"`
	Price       float32 `json:"price" binding:"required"`
	Quantity    int     `json:"quantity" binding:"required"`
	Discount    int     `json:"discount"`
}
