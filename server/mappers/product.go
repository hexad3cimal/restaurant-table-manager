package mappers

type ProductForm struct {
	ProductName string `json:"productName" binding:"required"`
	OrgId       string `json:"orgId"`
	BranchId    string `json:"branchId" binding:"required"`
	BranchName  string `json:"branchName" binding:"required"`
	Description string `json:"description" binding:"required"`
	Image       string `json:"image"`
	Price       string `json:"price" binding:"required"`
	Quantity    int    `json:"quantity"`
	Discount    int    `json:"discount"`
}
