package config

import (
	"fmt"

	_ "github.com/lib/pq"

	"github.com/jinzhu/gorm"
)

var DB *gorm.DB
var log = InitLogger()

func InitDB() {
	db, err := gorm.Open("postgres", "host="+GetConfig().Db.Host+" port="+GetConfig().Db.Port+" user="+GetConfig().Db.UserName+" dbname="+GetConfig().Db.Name+" password="+GetConfig().Db.Password)
	if err == nil {
		db.DB().SetMaxIdleConns(10)
		db.LogMode(true)
		fmt.Println("db")
		DB = db
	}
	fmt.Println(err)

}

func GetDB() *gorm.DB {
	return DB
}
