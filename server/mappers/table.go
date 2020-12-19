package mappers

type TableForm struct {
	ID         string `json:"id"`
	TableName  string `json:"name" binding:"required"`
	Password   string `json:"password"`
	LoginCode  string `json:"loginCode"`
	BranchId   string `json:"branchId" binding:"required"`
	BranchName string `json:"branchName" binding:"required"`
	UserName   string `json:"userName" binding:"required"`
	Edit       bool   `json:"edit" binding:"required"`
}

type GetTableForm struct {
	TableId  string `json:"tableId"`
	OrgId    string `json:"orgId"`
	BranchId string `json:"branchId"`
}
