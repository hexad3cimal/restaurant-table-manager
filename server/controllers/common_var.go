package controllers

import (
	"table-booking/authutils"
	"table-booking/config"
	"table-booking/models"
)

var branch = new(models.Branch)
var branchModel models.BranchModel

var user = new(models.User)
var userModel models.UserModel

var role = new(models.Role)
var roleModel models.RoleModel

var table = new(models.Table)
var tableModel models.TableModel

var logger = config.InitLogger()

var org = new(models.Organization)
var auth = new(authutils.Auth)

var productModel = models.ProductModel
var product = new(models.Product)
