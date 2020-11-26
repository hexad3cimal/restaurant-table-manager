package helpers

import (
	"table-booking/config"
	"table-booking/models"
)

var role = new(models.Role)
var roleModel models.RoleModel
var user = new(models.User)
var userModel models.UserModel
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

func GetRoleName(userId string, orgId string) (roleName string, err error) {

	userObject, getUserError := user.GetUserById(userId)
	if getUserError != nil {
		return "", getUserError
	}
	fetchedRole, err := role.GetRoleByIdAndOrg(userObject.RoleId, orgId)

	if err != nil {
		return "", err
	}

	return fetchedRole.Name, nil

}
