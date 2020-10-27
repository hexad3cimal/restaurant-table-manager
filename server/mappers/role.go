package mappers

type RoleForm struct {
	RoleName string `form:"roleName" json:"roleName" binding:"required"`
	OrgId    string `form:"orgId" json:"orgId" binding:"required"`
}
