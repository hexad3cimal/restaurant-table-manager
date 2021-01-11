package mappers

type TableForm struct {
	ID         string `json:"id"`
	TableName  string `json:"name" binding:"required"`
	Password   string `json:"newPassword"`
	LoginCode  string `json:"loginCode"`
	BranchId   string `json:"branchId" binding:"required"`
	BranchName string `json:"branchName" binding:"required"`
	UserName   string `json:"newUserName" binding:"required"`
	Edit       bool   `json:"edit"`
}

type GetTableForm struct {
	TableId  string `json:"tableId"`
	OrgId    string `json:"orgId"`
	BranchId string `json:"branchId"`
}
