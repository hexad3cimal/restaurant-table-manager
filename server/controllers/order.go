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
		logger.Error(c.ShouldBindJSON(&orderForm))
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("Get tokenmodel failed " + getTokenError.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	table, getTableError := user.GetUserById(orderForm.TableId)
	if getTableError != nil {
		logger.Error("Get tokenmodel failed " + getTableError.Error())
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if !helpers.IsUserAllowedToOrder(tokenModel.UserId, table.BranchId, tokenModel.OrgId, tokenModel.RoleId) {
		logger.Error("user not allowed for ordering " + tokenModel.UserId)

		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	orderModel.ID = uuid.NewV4().String()
	orderModel.CreatedAt = time.Now()
	orderModel.OrgId = tokenModel.OrgId
	orderModel.BranchId = table.BranchId
	orderModel.BranchName = table.BranchName
	orderModel.TableId = table.ID
	orderModel.Status = orderForm.Status
	orderModel.Price = orderForm.Price
	orderModel.Note = orderForm.Notes

	orderModel.RefCode = helpers.GetString()

	var orderItemsArray []models.OrderItemModel
	for _, productMapper := range orderForm.Products {
		var customisationsArray []models.CustomisationsModel
		for _, customisationId := range productMapper.Customisations {
			customisation, getCustomisationError := customisations.GetById(customisationId)
			if getCustomisationError != nil {
				logger.Error("customisation doesnt exist for table", orderModel.TableId)
			}
			customisationsArray = append(customisationsArray, customisation)
		}
		orderItemModel.ID = uuid.NewV4().String()
		orderItemModel.CreatedAt = time.Now()
		orderItemModel.OrgId = tokenModel.OrgId
		orderItemModel.BranchId = table.BranchId
		orderItemModel.BranchName = table.BranchName
		orderItemModel.Status = orderForm.Status
		orderItemModel.ProductId = productMapper.ProductId
		orderItemModel.ProductName = productMapper.ProductName
		orderItemModel.Quantity = productMapper.Quantity
		orderItemModel.KitchenId = productMapper.KitchenId
		orderItemModel.KitchenName = productMapper.KitchenName
		orderItemModel.TableId = table.ID
		orderItemModel.Customisations = customisationsArray
		orderItemModel.Price = productMapper.Price
		orderItemsArray = append(orderItemsArray, orderItemModel)

	}

	orderModel.OrderItems = orderItemsArray
	addedOrder, err := order.Add(orderModel)

	if err == nil {

		for _, orderItem := range orderItemsArray {
			helpers.EmitToSpecificClient(helpers.GetHub(), helpers.SocketEventStruct{EventName: "message", EventPayload: orderItem}, orderItem.KitchenId)
		}
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

		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		logger.Error("Create order failed: " + err.Error())
		order.DeleteById(addedOrder.ID)
		orderItem.DeleteByOrderId(orderModel.ID)
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
		logger.Error("get table error for" + tableId)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	isUserAssociatedWithBranch := false
	isManagerOrAdmin := helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tableObject.BranchId)
	if !isManagerOrAdmin {
		isUserAssociatedWithBranch = helpers.IsUserReallyAssociatedWithBranch(tokenModel.UserId, tableObject.BranchId, tokenModel.OrgId)
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
	var orders []models.OrderModel
	var error error
	if userRoleName == "admin" {
		orders = order.GetOrdersOfOrg(tokenModel.OrgId)

	}
	if userRoleName == "manager" {
		orders = order.GetOrdersOfBranch(tokenModel.BranchId)
	}
	if userRoleName == "kitchen" {
		orders = order.GetOpenOrdersOfKitchen(tokenModel.UserId)
	}
	if userRoleName == "table" {
		orders = order.GetByTableId(tokenModel.UserId)
	}
	if error == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": orders})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}
