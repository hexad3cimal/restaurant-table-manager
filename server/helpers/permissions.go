package helpers

import (
	"table-booking/config"
	"table-booking/models"
)

var role = new(models.Role)
var roleModel models.RoleModel
var logger = config.InitLogger()

func IsAdmin(roleId string, orgId string) (isAdmin bool) {
	fetchedRole, err := role.GetRoleByIdAndOrg(roleId, orgId)

	if err != nil {
		return false
	}
	logger.Error("fetchedRole.Name" + fetchedRole.Name)
	if fetchedRole.Name == "admin" {
		return true

	}
	return false

}

func GetRoleName(roleId string, orgId string) (roleName string, err error) {
	fetchedRole, err := role.GetRoleByIdAndOrg(roleId, orgId)

	if err != nil {
		return "", err
	}

	return fetchedRole.Name, nil

}
