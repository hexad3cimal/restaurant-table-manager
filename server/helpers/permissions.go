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
var token = new(models.Token)
var tokenModel models.TokenModel

func IsAdmin(userId string, orgId string) (isAdmin bool) {
	userObject, getUserError := user.GetUserById(userId)
	if getUserError != nil || userObject.OrgId != orgId {
		return false
	}
	fetchedRole, err := role.GetRoleByIdAndOrg(userObject.RoleId, orgId)

	if err != nil {
		return false
	}
	if fetchedRole.Name == "admin" {
		return true

	}
	return false

}

func GetRoleName(userId string, orgId string) (roleName string, err error) {

	userObject, getUserError := user.GetUserById(userId)
	if getUserError != nil || userObject.OrgId != orgId {
		return "", getUserError
	}
	fetchedRole, err := role.GetRoleByIdAndOrg(userObject.RoleId, orgId)

	if err != nil {
		return "", err
	}

	return fetchedRole.Name, nil

}

func GetToken(accessId string) (tokenReturnModel models.TokenModel, err error) {

	tokenModel, getTokenModelError := token.GetTokenById(accessId)

	if getTokenModelError != nil {
		return tokenModel, getTokenModelError
	}

	return tokenModel, nil
}
