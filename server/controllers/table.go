package controllers

import (
	"net/http"
	"strings"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type TableController struct{}

func (ctrl TableController) Add(c *gin.Context) {
	var tableForm mappers.TableForm

	if c.ShouldBindJSON(&tableForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	if !helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId) {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	// tableModel.Active = true
	// tableModel.ID = uuid.NewV4().String()
	// tableModel.Name = tableForm.TableName
	// tableModel.CreatedAt = time.Now()
	// tableModel.OrgId = tokenModel.OrgId
	// tableModel.BranchId = tableForm.BranchId
	// tableModel.BranchName = tableForm.BranchName
	// tableModel.Occupied = false
	// _, err := table.Add(tableModel)
	// if err == nil {
	//get branch role for current organisation
	roleModel, roleGetError := role.GetRoleByNameAndOrgId("table", tokenModel.OrgId)
	if roleGetError != nil {
		table.DeleteById(tableModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	//add new user with table role
	userModel.RoleId = roleModel.ID
	userModel.OrgId = tokenModel.OrgId
	userModel.BranchId = tableForm.BranchId
	userModel.BranchName = tableForm.BranchName
	bytePassword := []byte(tableForm.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		table.DeleteById(tableModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userModel.Name = tableForm.TableName
	userModel.UserName = tableForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(userModel.UserName)

	userModel.LoginCode = uuid.NewV4().String()
	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.ID = uuid.NewV4().String()
	_, userError := user.Register(userModel)
	if userError != nil {
		table.DeleteById(tableModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "success"})

}

func (ctrl TableController) GetTablesOfOrg(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	tables, err := table.GetTablesOfOrg(tokenModel.OrgId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}

// func (ctrl TableController) GetTables(c *gin.Context) {

// 	roleName, roleNameGetError := helpers.GetRoleName(c.GetHeader("role_id"), tokenModel.OrgId)
// 	if roleNameGetError != nil {
// 		logger.Error("Get rolename failed for " + c.GetHeader("role_id") + " " + tokenModel.OrgId + " " + roleNameGetError.Error())
// 		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
// 		return
// 	}

// 	var tables []models.TableModel
// 	var err error
// 	if roleName == "admin" {
// 		tables, err = table.GetTablesOfOrg(tokenModel.OrgId)

// 	}
// 	if roleName == "branch" || roleName == "kitchen" {
// 		tables, err = table.GetTablesOfBranch(tokenModel.OrgId)
// 	}

// 	if err == nil {
// 		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
// 		c.Abort()
// 		return
// 	} else {
// 		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
// 	}

// }

func (ctrl TableController) GetTables(c *gin.Context) {

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if !helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId) {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	roleName, roleNameGetError := helpers.GetRoleName(tokenModel.UserId, tokenModel.OrgId)
	if roleNameGetError != nil {
		logger.Error("Get rolename failed for " + tokenModel.UserId + " " + tokenModel.OrgId + " " + roleNameGetError.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	var tables []models.UserModel
	var err error
	tableRole, getTableRoleError := role.GetRoleByNameAndOrgId("table", tokenModel.OrgId)
	if getTableRoleError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	if roleName == "admin" {
		tables, err = user.GetUsersByOrgIdAndRoleId(tokenModel.OrgId, tableRole.ID)
		if err != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
		c.Abort()
		return
	}

	if roleName == "manager" {

		tables, err = user.GetUsersByBranchIdAndRoleId(tokenModel.BranchId, tableRole.ID)
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
			c.Abort()
			return
		}
	}
	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
}

func (ctrl TableController) GetTable(c *gin.Context) {

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	loginCode, gotCode := c.GetQuery("loginCode")
	var tableModel models.UserModel
	var err error
	if gotCode {

		tableModel, err = user.GetUserByLoginCode(loginCode)
	} else {
		tableId, gotId := c.GetQuery("loginCode")
		if gotId {
			tableModel, err = user.GetUserById(tableId)
		}
	}
	if err == nil && tableModel.OrgId == tokenModel.OrgId {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tableModel})
		c.Abort()
		return
	}

	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
}
