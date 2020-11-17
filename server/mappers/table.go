package mappers

type TableForm struct {
	TableName string `json:"tableName" binding:"required"`
	BranchId  string `json:"branchId" binding:"required"`
}

type GetTableForm struct {
	TableId  string `json:"tableId"`
	OrgId    string `json:"orgId"`
	BranchId string `json:"branchId"`
}
