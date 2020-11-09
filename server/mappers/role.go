package mappers

type RoleForm struct {
	RoleName string `json:"roleName" binding:"required"`
	OrgId    string `json:"orgId" binding:"required"`
}
