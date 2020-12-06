package mappers

type KitchenForm struct {
	Name       string `json:"name" binding:"required"`
	Password   string `json:"password" binding:"required"`
	BranchId   string `json:"branchId" binding:"required"`
	BranchName string `json:"branchName" binding:"required"`
	UserName   string `json:"userName" binding:"required"`
}
