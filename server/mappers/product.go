package mappers

import "mime/multipart"

type CustomisationItem struct {
	Name        string `json:"title"`
	Description string `json:"itemDescription"`
	Price       string `json:"itemPrice"`
}

type ProductForm struct {
	Id            string                `form:"id"`
	ProductName   string                `form:"name" binding:"required"`
	OrgId         string                `form:"orgId"`
	Highlight     bool                  `form:"highlight"`
	BranchId      string                `form:"branchId" binding:"required"`
	BranchName    string                `form:"branchName" binding:"required"`
	KitchenId     string                `form:"kitchenId" binding:"required"`
	KitchenName   string                `form:"kitchenName" binding:"required"`
	Description   string                `form:"description"`
	Tags          string                `form:"tags"`
	Image         *multipart.FileHeader `form:"file"  binding:"omitempty"`
	Price         float32               `form:"price" binding:"required"`
	Category      string                `form:"category"`
	Quantity      int                   `form:"quantity"`
	Discount      int                   `form:"discount"`
	Customisation string                `form:"customisations"`
	Edit          bool                  `form:"edit"`
}
