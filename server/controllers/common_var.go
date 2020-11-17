package controllers

import (
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
