package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"
	"table-booking/config"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/twinj/uuid"
)

type ProductController struct{}

func (ctrl ProductController) AddOrEdit(c *gin.Context) {
	var productForm mappers.ProductForm
	var productError error
	var customisation []mappers.CustomisationItem
	var customisationsSlice []models.CustomisationsModel
	if c.ShouldBind(&productForm) != nil {
		logger.Error("invalid product form ", c.ShouldBind(&productForm).Error())

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if !helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId) {
		logger.Error("not an admin or manager  ", tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId)

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

	if productForm.Edit {
		productModel, productError = product.GetById(productForm.Id)
		for _, productTag := range productModel.Tags {
			_, deleteTagError := tag.DeleteById(productTag.ID)
			if deleteTagError != nil {
				logger.Error("Delete tag failed for tag " + productTag.ID)
			}
		}
		if productError != nil {
			logger.Error("invalid product id " + productForm.Id)
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	} else {
		productModel.ID = uuid.NewV4().String()
		productModel.CreatedAt = time.Now()
		productModel.Active = true
	}
	productModel.Name = productForm.ProductName
	productModel.OrgId = tokenModel.OrgId
	productModel.BranchId = productForm.BranchId
	productModel.BranchName = productForm.BranchName
	productModel.KitchenId = productForm.KitchenId
	productModel.KitchenName = productForm.KitchenName
	productModel.Quantity = productForm.Quantity
	productModel.Price = productForm.Price
	productModel.CategoryId = productForm.Category
	productError = json.Unmarshal([]byte(productForm.Customisation), &customisation)
	if productError != nil {
		logger.Error("add product failed " + productError.Error())

		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	if len(customisation) > 0 {
		for _, customisationItem := range customisation {
			customisationModel.ID = uuid.NewV4().String()
			customisationModel.Name = customisationItem.Name
			customisationModel.Description = customisationItem.Description
			customisationModel.CreatedAt = time.Now()
			price, _ := strconv.ParseFloat(customisationItem.Price, 32)
			customisationModel.Price = float32(price)
			customisationModel.Active = true
			customisationModel.ProductId = productModel.ID
			customisationsSlice = append(customisationsSlice, customisationModel)
		}
	}
	tags := strings.Split(productForm.Tags, ",")
	var addedTags []string
	var tagArray []models.TagModel
	var tagError error
	for _, tagName := range tags {
		if tagName != "" {
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
	productModel.Customisations = customisationsSlice
	productModel.Active = true
	_, productError = product.Add(productModel)
	if productError == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		logger.Error("add product failed " + productError.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}
}

func (ctrl ProductController) GetProductsOfBranch(c *gin.Context) {

	branchId, gotValue := c.GetQuery("branchId")
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
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
	var products []models.ProductModel
	var error error
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		logger.Error("getTokenError failed for GetProducts ", getTokenError.Error())

		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userRoleName, getRoleError := helpers.GetRoleName(tokenModel.UserId, tokenModel.OrgId)

	if getRoleError != nil {
		logger.Error("Get role failed for GetProducts ", getRoleError.Error())
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if userRoleName == "admin" {
		products, error = product.GetProductsOfOrg(tokenModel.OrgId)

		if error != nil {
			logger.Error("GetProductsOfOrg failed for GetProducts ", error.Error())

			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	} else {

		products, error = product.GetProductsOfBranch(tokenModel.BranchId)

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
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
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

func (ctrl ProductController) ValidateProduct(c *gin.Context) {
	productName, gotproductName := c.GetQuery("productName")
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	if gotproductName == true {
		userRoleName, getRoleError := helpers.GetRoleName(tokenModel.UserId, tokenModel.OrgId)
		var branchId string
		var gotBranchId bool

		if getRoleError != nil {
			logger.Error("GetRoleName failed for ValidateProduct ", getRoleError.Error())
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
		if userRoleName == "admin" {
			branchId, gotBranchId = c.GetQuery("branchId")
			if !gotBranchId {
				c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
				c.Abort()
				return
			}
		} else {
			branchId = tokenModel.BranchId
		}
		_, getProductError := product.GetByNameAndBranchId(strings.ToLower(productName), branchId)
		if getProductError != nil {
			if errors.Is(getProductError, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusOK, gin.H{"data": true})
				c.Abort()
				return
			}
		}
		id, gotEdit := c.GetQuery("edit")
		if gotEdit {
			productObject, _ := product.GetById(id)
			if productObject.NameLower == strings.ToLower(productName) {
				c.JSON(http.StatusOK, gin.H{"data": true})
				c.Abort()
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"data": false})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": false})
}

func (ctrl ProductController) Delete(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	if !helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId) {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	productId, gotProductId := c.GetQuery("id")

	if gotProductId {
		_, deleteProductError := product.DeleteById(productId)
		if deleteProductError == nil {
			_, deleteCustomisationsError := customisations.DeleteByProductId(productId)
			if deleteCustomisationsError != nil {
				logger.Error("Delete customisations failed for product ", productId, deleteCustomisationsError.Error())
			}
		}
		c.JSON(http.StatusAccepted, gin.H{"message": "success"})
		c.Abort()
		return
	}
	c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	c.Abort()
	return
}
