package env

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	"github.com/spf13/viper"
)

var EnvConfigs *EnvironmentConfig
var ServerConfigs *PackageConfig
var WebConfigs *PackageConfig

func InitEnvConfigs() {
	EnvConfigs = loadEnvVariables()
	ServerConfigs = fetchDataFromPackages("../server/package.json")
	WebConfigs = fetchDataFromPackages("../client/package.json")
}

type EnvironmentConfig struct {
	Mode string `mapstructure:"NODE_ENV"`
	Port string `mapstructure:"SERVER_PORT"`
	DatabaseHost string `mapstructure:"DB_HOST"`
	SocketHost string `mapstructure:"SOCKET_HOST"`
	StripeKey string `mapstructure:"STRIPE_KEY"`
	StripeWebhookKey string `mapstructure:"STRIPE_WEBHOOK_KEY"`
}

type PackageConfig struct {
	Version string `json:"version"`
}

func loadEnvVariables() (config *EnvironmentConfig) {
	viper.AddConfigPath("../../")
	viper.SetConfigType("env")

	viper.SetConfigName(".env.local")
	err := viper.ReadInConfig()

	if err != nil {
		viper.SetConfigName(".env")
		err = viper.ReadInConfig()
	}

	if err != nil {
		log.Fatal("Configs: failed to load environment variables", err)
		return
	}

	if err := viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
		return
	}
	return
}


func fetchDataFromPackages(path string) (config *PackageConfig) {
	file, err := os.Open(path)
	if err != nil {
		log.Fatalf(err.Error())
		return
	}
	defer file.Close()

	data, err := ioutil.ReadAll(file)
	if err != nil {
		log.Fatalf(err.Error())
		return
	}

	var packageData PackageConfig
	err = json.Unmarshal(data, &packageData)
	if err != nil {
		log.Fatalf(err.Error())
		return
	}

	return &packageData
}