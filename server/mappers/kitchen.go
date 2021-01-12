package mappers

type KitchenForm struct {
	Id         string `json:"id"`
	Name       string `json:"name" binding:"required"`
	Password   string `json:"newPassword"`
	BranchId   string `json:"branchId" binding:"required"`
	BranchName string `json:"branchName" binding:"required"`
	UserName   string `json:"newUserName" binding:"required"`
	Edit       bool   `json:"edit"`
}
