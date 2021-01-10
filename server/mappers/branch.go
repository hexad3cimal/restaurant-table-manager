package mappers

type BranchForm struct {
	Id         string `json:"id" `
	Name       string `json:"name" binding:"required,max=100"`
	UserName   string `json:"newUserName" binding:"required,max=100"`
	BranchId   string `json:"branchId"`
	BranchName string `json:"branchName"`
	Address    string `json:"address"`
	Email      string `json:"email"`
	Password   string `json:"newPassword"`
	Contact    string `json:"contact"`
	OrgId      string `json:"orgId"`
	Edit       bool   `json:"edit" binding:"required"`
}

type GetBranchForm struct {
	Name  string `json:"name"`
	OrgId string `json:"orgId"`
}
