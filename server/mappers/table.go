package mappers

type TableForm struct {
	TableName string `json:"tableName" binding:"required"`
	OrgId     string `json:"orgId" binding:"required"`
}
