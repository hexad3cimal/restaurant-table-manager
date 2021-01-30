package controllers

import (
	"net/http"
	"table-booking/helpers"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type SocketController struct{}

func (ctrl SocketController) Handle(c *gin.Context) {
	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		logger.Error("invalid access uuid ", c.GetHeader("access_uuid"))
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	hub := helpers.GetHub()
	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin:     func(r *http.Request) bool { return true },
	}

	connection, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		panic(err)
	}
	helpers.CreateNewSocketUser(hub, connection, tokenModel.UserId, tokenModel.UserId)
}
