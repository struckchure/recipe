package main

import (
	"log"
	"net/http"

	rtctokenbuilder "github.com/AgoraIO/Tools/DynamicKey/AgoraDynamicKey/go/src/rtctokenbuilder2"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/spf13/viper"
)

type Env struct {
	ALGORA_APP_ID          string
	ALGORA_APP_CERTIFICATE string
}

func NewEnv() *Env {
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalln(err)
	}

	return &Env{
		ALGORA_APP_ID:          viper.GetString("ALGORA_APP_ID"),
		ALGORA_APP_CERTIFICATE: viper.GetString("ALGORA_APP_CERTIFICATE"),
	}
}

type RtcTokenStruct struct {
	UserId      uint32 `json:"uid"`
	ChannelName string `json:"channelName"`
	Role        uint32 `json:"role"`
}

// Use RtcTokenBuilder to generate RTC Token
func getRtcTokenService(userId uint32, channelName string, role rtctokenbuilder.Role) (string, error) {
	var env = NewEnv()
	// Ensure that the expiration time of the token is later than the permission expiration time. Permission expiration time, unit is seconds
	tokenExpireTimeInSeconds := uint32(40)
	// The token-privilege-will-expire callback is triggered 30 seconds before the permission expires.
	// For demonstration purposes, set the expiration time to 40 seconds. You can see the process of the client automatically updating the Token
	privilegeExpireTimeInSeconds := uint32(40)

	return rtctokenbuilder.BuildTokenWithUid(env.ALGORA_APP_ID, env.ALGORA_APP_CERTIFICATE, channelName, userId, role, tokenExpireTimeInSeconds, privilegeExpireTimeInSeconds)
}

func getRtcTokenHandler(c echo.Context) error {
	var role rtctokenbuilder.Role

	var payload RtcTokenStruct
	err := c.Bind(&payload)

	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	switch payload.Role {
	case 1:
		role = rtctokenbuilder.RolePublisher
	case 2:
		role = rtctokenbuilder.RoleSubscriber
	}

	token, err := getRtcTokenService(payload.UserId, payload.ChannelName, role)
	if err != nil {
		c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]string{"token": token})
}

func main() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}, latency_human=${latency_human}\n",
	}))
	e.Use(middleware.Recover())

	e.POST("/api/token", getRtcTokenHandler)

	e.Logger.Fatal(e.Start(":8080"))
}
