package controllers

import (
	"net/http"
	"strings"
	"table-booking/config"
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

	if c.ShouldBind(&productForm) != nil {
		logger.Error("inavlid product form ", c.ShouldBind(&productForm).Error())

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
	if productForm.Image.Filename != "" {
		imageName, imageUploadError := helpers.SaveFile(c.Request, config.GetConfig().Uploads.Base+config.GetConfig().Uploads.Products)
		if imageUploadError != nil {
			logger.Error("image upload failed" + imageUploadError.Error())
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		productModel.Image = config.GetConfig().Uploads.Products + imageName

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
	tags := strings.Split(productForm.Tags, ",")
	var addedTags []string
	var tagArray []models.TagModel
	var tagError error
	for _, tagName := range tags {
		tagM, _ := tag.GetByNameAndBranchId(strings.ToLower(tagName), productForm.BranchId)
		if tagM.ID == "" {
			tagModel.ID = uuid.NewV4().String()
			tagModel.Name = tagName
			tagModel.NameLower = strings.ToLower(tagName)
			tagModel.OrgId = tokenModel.OrgId
			tagModel.BranchId = productForm.BranchId
			tagModel.Active = true
			tagModel, tagError = tag.Add(tagModel)
			addedTags = append(addedTags, tagName)
			tagArray = append(tagArray, tagModel)

		} else {
			tagArray = append(tagArray, tagM)
		}

	}
	if tagError != nil {
		for _, tagName := range addedTags {
			_, _ = tag.DeleteByName(tagName)
		}
		logger.Error("tag addition failed for product", productModel)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	productModel.Discount = productForm.Discount
	productModel.Highlight = productForm.Highlight
	productModel.Description = productForm.Description
	productModel.Tags = tagArray
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

func (ctrl ProductController) GetTopProducts(c *gin.Context) {

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
		products, error = product.GetMostOrderedProductsOfBranch(tokenModel.OrgId)

		if error != nil {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	} else {

		products, error = product.GetMostOrderedProductsOfBranch(tokenModel.BranchId)

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
