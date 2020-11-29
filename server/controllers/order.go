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

	table, getTableError := table.GetTableById(orderForm.TableId)
	if getTableError != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
		c.Abort()
		return
	}
	orderModel.ID = uuid.NewV4().String()
	orderModel.ProductName = orderForm.ProductName
	orderModel.ProductId = orderForm.ProductId
	orderModel.CreatedAt = time.Now()
	orderModel.OrgId = c.GetHeader("org_id")
	orderModel.BranchId = table.BranchId
	orderModel.BranchName = table.BranchName
	orderModel.TableId = table.ID
	orderModel.Quantity = orderForm.Quantity
	orderModel.Note = orderForm.Notes
	orderModel.Status = orderForm.Status

	_, err := order.Add(orderModel)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		logger.Error("Crreate order failed: " + err.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}
}

func (ctrl OrderController) GetOrdersOfTable(c *gin.Context) {

	tableId, gotValue := c.GetQuery("tableId")
	if gotValue != true {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	orders := order.GetByTableId(tableId)
	c.JSON(http.StatusOK, gin.H{"message": "success", "data": orders})
}

func (ctrl OrderController) GetOrders(c *gin.Context) {

	userRoleName, getRoleError := helpers.GetRoleName(c.GetHeader("user_id"), c.GetHeader("org_id"))

	if getRoleError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	var products []models.ProductModel
	var error error
	if userRoleName == "admin" {
		products, error = product.GetProductsOfOrg(c.GetHeader("org_id"))

		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	} else {

		currentUser, getCurrentUserError := user.GetUserById(c.GetHeader("user_id"))
		if getCurrentUserError != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		products, error = product.GetProductsOfBranch(currentUser.BranchId)

		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}

	}
	if error == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": products})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

}
