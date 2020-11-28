package mappers

type TableForm struct {
	TableName  string `json:"tableName" binding:"required"`
	Password   string `json:"password" binding:"required"`
	BranchId   string `json:"branchId" binding:"required"`
	BranchName string `json:"branchName" binding:"required"`
}

type GetTableForm struct {
	TableId  string `json:"tableId"`
	OrgId    string `json:"orgId"`
	BranchId string `json:"branchId"`
}
