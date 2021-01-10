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
	hub := helpers.GetHub()
	go hub.Run()
	db := config.GetDB()
	db.AutoMigrate(&models.UserModel{})
	db.AutoMigrate(&models.RoleModel{})
	db.AutoMigrate(&models.TableModel{})
	db.AutoMigrate(&models.ProductModel{})
	db.AutoMigrate(&models.OrderModel{})
	db.AutoMigrate(&models.TokenModel{})
	db.AutoMigrate(&models.OrderItemModel{})

	//add foreign keys
	db.Model(&models.UserModel{}).AddForeignKey("role_id", "role_models(id)", "RESTRICT", "RESTRICT")
	router.InitRouter()
}
