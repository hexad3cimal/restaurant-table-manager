package main

import (
	"table-booking/config"
	"table-booking/helpers"
	"table-booking/models"
	"table-booking/router"
)

func main() {

	config.InitLogger()

	config.InitConfig()
	config.InitDB()
	helpers.InitHub()
	db := config.GetDB()
	db.AutoMigrate(&models.OrganizationModel{})
	db.AutoMigrate(&models.UserModel{})
	db.AutoMigrate(&models.RoleModel{})
	db.AutoMigrate(&models.TableModel{})
	db.AutoMigrate(&models.BranchModel{})
	db.AutoMigrate(&models.ProductModel{})
	db.AutoMigrate(&models.OrderModel{})
	db.AutoMigrate(&models.TokenModel{})

	router.InitRouter()
}
