package helpers

import "table-booking/models"

var role = new(models.Role)
var roleModel models.RoleModel

func IsAdmin(roleId string, orgId string) (isAdmin bool) {
	fetchedRole, err := role.GetRoleByIdAndOrg(roleId, orgId)

	if err != nil {
		return false
	}
	if fetchedRole.Name == "admin" {
		return true

	}
	return false

}
