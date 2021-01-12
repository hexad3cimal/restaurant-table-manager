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

func IsAdmin(accessUUID string) (isAdmin bool) {
	tokenModel, getTokenError := token.GetTokenById(accessUUID)
	if getTokenError != nil {

		return false
	}
	userObject, getUserError := user.GetUserById(tokenModel.UserId)
	if getUserError != nil || userObject.OrgId != tokenModel.OrgId {
		return false
	}
	fetchedRole, err := role.GetRoleByIdAndOrg(userObject.RoleId, tokenModel.OrgId)

	if err != nil {
		return false
	}
	if fetchedRole.Name == "admin" {
		return true

	}
	return false

}

func AdminOrManagerOfTheOrgAndBranch(userId string, orgId string, branchId string) (isAdmin bool) {
	userObject, getUserError := user.GetUserById(userId)
	if getUserError != nil || userObject.OrgId != orgId {
		logger.Error("getUserError failed " + getUserError.Error())
		return false

	}

	fetchedRole, err := role.GetRoleByIdAndOrg(userObject.RoleId, orgId)

	if err != nil {
		logger.Error("fetchedRole failed " + err.Error())
		return false
	}
	if fetchedRole.Name == "admin" && userObject.OrgId == orgId {

		return true

	}
	if fetchedRole.Name == "manager" && userObject.OrgId == orgId && userObject.BranchId == branchId {
		return true

	}
	return false

}

func IsUserReallyAssociatedWithBranch(userId string, branchId string, orgId string) (associated bool) {
	userObject, getUserError := user.GetUserById(userId)
	if getUserError != nil || userObject.OrgId != orgId || userObject.BranchId != branchId {
		return false
	}

	return true

}

func IsUserAllowedToOrder(userId string, branchId string, orgId string, roleId string) (associated bool) {
	if AdminOrManagerOfTheOrgAndBranch(userId, orgId, branchId) {
		return true
	}
	fetchedRole, err := role.GetRoleByIdAndOrg(roleId, orgId)

	if err != nil {
		return false
	}
	if fetchedRole.Name == "table" {
		return true
	}
	return false

}

func IsUserAllowedToAddProduct(userId string, branchId string, orgId string, roleId string) (associated bool) {
	if AdminOrManagerOfTheOrgAndBranch(userId, branchId, orgId) {
		return true
	}
	fetchedRole, err := role.GetRoleByIdAndOrg(roleId, orgId)

	if err != nil {
		return false
	}
	if fetchedRole.Name == "kitchen" {
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
