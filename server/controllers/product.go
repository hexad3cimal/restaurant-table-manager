package controllers

import (
	"net/http"
	"table-booking/mappers"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

type ProductController struct{}

func (ctrl ProductController) Add(c *gin.Context) {
	var productForm mappers.ProductForm

	if c.ShouldBindJSON(&productForm) != nil {
		logger.Error("inavlid product form ")

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	productModel.ID = uuid.NewV4().String()
	productModel.ProductName = productForm.ProductName
	productModel.CreatedAt = time.Now()
	productModel.OrgId = c.GetHeader("org_id")
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
