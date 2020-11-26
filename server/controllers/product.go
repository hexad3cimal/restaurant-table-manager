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

	productModel.ID = uuid.NewV4().String()
	productModel.ProductName = productForm.ProductName
	productModel.CreatedAt = time.Now()
	productModel.OrgId = c.GetHeader("org_id")
	productModel.BranchId = productForm.BranchId
	productModel.BranchName = productForm.BranchName
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
	if gotValue != true {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
		c.Abort()
		return
	}
	products, err := product.GetProductsOfBranch(branchId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": products})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}

func (ctrl ProductController) GetProducts(c *gin.Context) {

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
