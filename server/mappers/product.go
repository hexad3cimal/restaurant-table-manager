package mappers

import "mime/multipart"

type ProductForm struct {
	ProductName string                `form:"productName" binding:"required"`
	OrgId       string                `form:"orgId"`
	Highlight   bool                  `form:"highlight"`
	BranchId    string                `form:"branchId" binding:"required"`
	BranchName  string                `form:"branchName" binding:"required"`
	KitchenId   string                `form:"kitchenId" binding:"required"`
	KitchenName string                `form:"kitchenName" binding:"required"`
	Description string                `form:"description" binding:"required"`
	Tags        string                `form:"tags"`
	Image       *multipart.FileHeader `form:"file"  binding:"omitempty"`
	Price       string                `form:"price" binding:"required"`
	Quantity    int                   `form:"quantity"`
	Discount    int                   `form:"discount"`
}
