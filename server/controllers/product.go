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

type ProductController struct{}

func (ctrl ProductController) Add(c *gin.Context) {
	var productForm mappers.ProductForm

	if c.ShouldBindJSON(&productForm) != nil {
		logger.Error("inavlid product form ", c.ShouldBindJSON(&productForm).Error())

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
	productModel.ID = uuid.NewV4().String()
	productModel.Name = productForm.ProductName
	productModel.CreatedAt = time.Now()
	productModel.OrgId = tokenModel.OrgId
	productModel.BranchId = productForm.BranchId
	productModel.BranchName = productForm.BranchName
	productModel.KitchenId = productForm.KitchenId
	productModel.KitchenName = productForm.KitchenName
	productModel.Quantity = productForm.Quantity
	productModel.Price = productForm.Price
	productModel.Discount = productForm.Discount
	productModel.Description = productForm.Description
	productModel.Image = productForm.Image

	_, err := product.Add(productModel)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}
}

func (ctrl ProductController) GetProductsOfBranch(c *gin.Context) {

	branchId, gotValue := c.GetQuery("branchId")
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	isUserAssociatedWithBranch := false
	isManagerOrAdmin := helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, branchId)
	if !isManagerOrAdmin {
		isUserAssociatedWithBranch = helpers.IsUserReallyAssociatedWithBranch(tokenModel.UserId, tokenModel.OrgId, branchId)
	}

	if isManagerOrAdmin || isUserAssociatedWithBranch {
		if gotValue != true {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
			c.Abort()
			return
		}
		products, err := product.GetProductsOfBranch(branchId)
		if err == nil {
			c.JSON(http.StatusOK, gin.H{"message": "success", "data": products})
			c.Abort()
			return
		}
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
		c.Abort()
		return

	}
	c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})

}

func (ctrl ProductController) GetProducts(c *gin.Context) {

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
	} else {

		currentUser, getCurrentUserError := user.GetUserById(tokenModel.UserId)
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
