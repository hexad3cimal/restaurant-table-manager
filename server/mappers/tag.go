package mappers

type TagForm struct {
	Name      string `json:"name" binding:"required"`
	BranchId  string `json:"branchId" binding:"required"`
	ProductId string `json:"productId" binding:"required"`
}
