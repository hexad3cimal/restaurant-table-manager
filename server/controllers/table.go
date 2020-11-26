package controllers

import (
	"net/http"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

type TableController struct{}

func (ctrl TableController) Add(c *gin.Context) {
	var tableForm mappers.TableForm

	if c.ShouldBindJSON(&tableForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tableModel.Active = true
	tableModel.ID = uuid.NewV4().String()
	tableModel.Name = tableForm.TableName
	tableModel.CreatedAt = time.Now()
	tableModel.OrgId = c.GetHeader("org_id")
	tableModel.BranchId = tableForm.BranchId
	tableModel.BranchName = tableForm.BranchName
	tableModel.Occupied = false
	_, err := table.Add(tableModel)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}

func (ctrl TableController) GetTablesOfOrg(c *gin.Context) {

	tables, err := table.GetTablesOfOrg(c.GetHeader("org_id"))
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}

// func (ctrl TableController) GetTables(c *gin.Context) {

// 	roleName, roleNameGetError := helpers.GetRoleName(c.GetHeader("role_id"), c.GetHeader("org_id"))
// 	if roleNameGetError != nil {
// 		logger.Error("Get rolename failed for " + c.GetHeader("role_id") + " " + c.GetHeader("org_id") + " " + roleNameGetError.Error())
// 		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
// 		return
// 	}

// 	var tables []models.TableModel
// 	var err error
// 	if roleName == "admin" {
// 		tables, err = table.GetTablesOfOrg(c.GetHeader("org_id"))

// 	}
// 	if roleName == "branch" || roleName == "kitchen" {
// 		tables, err = table.GetTablesOfBranch(c.GetHeader("org_id"))
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

	roleName, roleNameGetError := helpers.GetRoleName(c.GetHeader("user_id"), c.GetHeader("org_id"))
	if roleNameGetError != nil {
		logger.Error("Get rolename failed for " + c.GetHeader("user_id") + " " + c.GetHeader("org_id") + " " + roleNameGetError.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		return
	}
	var tables []models.TableModel
	var err error
	if roleName == "admin" {
		tables, err = table.GetTablesOfOrg(c.GetHeader("org_id"))
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
		c.Abort()
		return
	}

	if roleName == "manager" {
		userObject, getUserError := user.GetUserById(c.GetHeader("user_id"))
		if getUserError != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}

		tables, err = table.GetTablesOfBranch(userObject.BranchId)
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
			c.Abort()
			return
		} else {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}
	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
}
