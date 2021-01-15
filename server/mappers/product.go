package mappers

import "mime/multipart"

type Customisation struct {
	Name        string `form:"name"`
	Description string `form:"description"`
	Price       string `form:"price"`
}
type ProductForm struct {
	Id             string                `form:"id"`
	ProductName    string                `form:"name" binding:"required"`
	OrgId          string                `form:"orgId"`
	Highlight      bool                  `form:"highlight"`
	BranchId       string                `form:"branchId" binding:"required"`
	BranchName     string                `form:"branchName" binding:"required"`
	KitchenId      string                `form:"kitchenId" binding:"required"`
	KitchenName    string                `form:"kitchenName" binding:"required"`
	Description    string                `form:"description"`
	Tags           string                `form:"tags"`
	Image          *multipart.FileHeader `form:"file"  binding:"omitempty"`
	Price          string                `form:"price" binding:"required"`
	Category       string                `form:"category" binding:"required"`
	Quantity       int                   `form:"quantity"`
	Discount       int                   `form:"discount"`
	Customisation  Customisation         `form:"customisation"`
	Customisations []Customisation       `form:"customisations"`
	Edit           bool                  `form:"edit"`
}
