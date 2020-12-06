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

type OrderController struct{}

func (ctrl OrderController) Add(c *gin.Context) {
	var orderForm mappers.OrderForm

	if c.ShouldBindJSON(&orderForm) != nil {
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

	table, getTableError := table.GetTableById(orderForm.TableId)
	if getTableError != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if !helpers.IsUserAllowedToOrder(tokenModel.UserId, table.BranchId, tokenModel.OrgId, tokenModel.RoleId) {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	orderModel.ID = uuid.NewV4().String()
	orderModel.ProductName = orderForm.ProductName
	orderModel.ProductId = orderForm.ProductId
	orderModel.CreatedAt = time.Now()
	orderModel.OrgId = tokenModel.OrgId
	orderModel.KitchenId = orderForm.KitchenId
	orderModel.KitchenName = orderForm.KitchenName
	orderModel.BranchId = table.BranchId
	orderModel.BranchName = table.BranchName
	orderModel.TableId = table.ID
	orderModel.Quantity = orderForm.Quantity
	orderModel.Note = orderForm.Notes
	orderModel.Status = orderForm.Status

	_, err := order.Add(orderModel)
	if err == nil {
		managerRole, rolesGetError := role.GetRoleByNameAndOrgId("manager", tokenModel.OrgId)
		if rolesGetError != nil {
			order.DeleteById(orderModel.ID)
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		users, userError := user.GetUsersByOrgIdAndRoleId(tokenModel.OrgId, managerRole.ID)
		if userError != nil {
			order.DeleteById(orderModel.ID)
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}

		for _, user := range users {
			helpers.EmitToSpecificClient(helpers.GetHub(), helpers.SocketEventStruct{EventName: "message", EventPayload: orderModel}, user.ID)
		}
		helpers.EmitToSpecificClient(helpers.GetHub(), helpers.SocketEventStruct{EventName: "message", EventPayload: orderModel}, orderForm.KitchenId)

		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		logger.Error("Crreate order failed: " + err.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}
}

func (ctrl OrderController) GetOrdersOfTable(c *gin.Context) {

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	tableId, gotValue := c.GetQuery("tableId")
	if gotValue != true {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	tableObject, getTableError := user.GetUserById(tableId)
	if getTableError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	isUserAssociatedWithBranch := false
	isManagerOrAdmin := helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tableObject.BranchId)
	if !isManagerOrAdmin {
		isUserAssociatedWithBranch = helpers.IsUserReallyAssociatedWithBranch(tokenModel.UserId, tokenModel.OrgId, tableObject.BranchId)
	}

	if isManagerOrAdmin || isUserAssociatedWithBranch {

		orders := order.GetByTableId(tableId)
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": orders})
		c.Abort()
		return
	}
	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	c.Abort()
	return
}

func (ctrl OrderController) GetOrders(c *gin.Context) {

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userRoleName, getRoleError := helpers.GetRoleName(tokenModel.UserId, tokenModel.OrgId)

	if getRoleError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	var products []models.ProductModel
	var error error
	if userRoleName == "admin" {
		products, error = product.GetProductsOfOrg(tokenModel.OrgId)

		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}

	products, error = product.GetProductsOfBranch(tokenModel.BranchId)

	if error == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": products})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}
