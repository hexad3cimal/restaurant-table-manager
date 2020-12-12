package config

import (
	"fmt"

	"github.com/spf13/viper"
)

var Config *Configuration

type Db struct {
	Host     string
	Name     string
	Port     string
	UserName string
	Password string
}

type Uploads struct {
	Base     string
	Products string
}
type Configuration struct {
	Port    string
	Db      Db
	Secret  string
	Uploads Uploads
}

func InitConfig() {
	var configuration *Configuration

	viper.AddConfigPath("./env")
	viper.SetConfigType("yml")
	viper.SetConfigName("dev")
	viper.AutomaticEnv()

	err := viper.ReadInConfig()

	if err != nil {
		log.Error(err)
	}

	notOk := viper.Unmarshal(&configuration)
	if notOk != nil {
		log.Error("Invalid config" + notOk.Error())
	}

	fmt.Println(configuration)
	Config = configuration
}

// GetConfig helps you to get configuration data
func GetConfig() *Configuration {
	return Config
}
