package controllers

import (
	"table-booking/authutils"
	"table-booking/config"
	"table-booking/models"
)

var user = new(models.User)
var userModel models.UserModel

var role = new(models.Role)
var roleModel models.RoleModel

var logger = config.InitLogger()

var auth = new(authutils.Auth)

var productModel models.ProductModel
var product = new(models.Product)

var orderModel models.OrderModel
var order = new(models.Order)

var token = new(models.Token)
var tokenModel models.TokenModel

var category = new(models.Category)
var categoryModel models.CategoryModel

var tag = new(models.Tag)
var tagModel models.TagModel

var orderItem = new(models.OrderItem)
var orderItemModel models.OrderItemModel

var customisations = new(models.Customisations)
var customisationModel models.CustomisationsModel

var dashboard = new(models.DashBoard)
