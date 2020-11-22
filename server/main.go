package main

import (
	"table-booking/config"
	"table-booking/models"
	"table-booking/router"
)

func main() {

	config.InitLogger()

	config.InitConfig()
	config.InitDB()
	db := config.GetDB()
	db.AutoMigrate(&models.OrganizationModel{})
	db.AutoMigrate(&models.UserModel{})
	db.AutoMigrate(&models.RoleModel{})
	db.AutoMigrate(&models.TableModel{})
	db.AutoMigrate(&models.BranchModel{})
	db.AutoMigrate(&models.ProductModel{})

	router.InitRouter()
}
