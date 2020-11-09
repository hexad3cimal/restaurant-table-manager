package main

import (
	"table-booking/config"
	"table-booking/models"
	"table-booking/utils"
)

func main() {

	config.InitLogger()

	config.InitConfig()
	config.InitDB()
	db := config.GetDB()
	db.AutoMigrate(&models.OrganizationModel{})
	db.AutoMigrate(&models.UserModel{})
	db.AutoMigrate(&models.RoleModel{})

	utils.InitRouter()
}
