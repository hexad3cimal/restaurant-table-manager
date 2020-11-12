package controllers

import (
	"net/http"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
)

type Api struct{}

var userModel = new(models.User)
var org = new(models.Organization)
var roleModel = new(models.Role)

func (ctrl Api) Login(c *gin.Context) {
	var loginForm mappers.LoginForm

	if c.ShouldBindJSON(&loginForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	user, token, err := userModel.Login(loginForm)
	if err == nil {
		// c.SetCookie("okten", token.AccessToken, 60*60*15, "/", "127.0.0.1", false, false)
		// c.SetCookie("refresh-token", token.RefreshToken, 60*60*30, "/", "127.0.0.1", false, false)
		c.JSON(http.StatusOK, gin.H{"message": "User signed in", "name": user.Name, "token": token.AccessToken, "refresh-token": token.RefreshToken})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid login details", "error": err.Error()})
	}

}

func (ctrl Api) Register(c *gin.Context) {
	var registerForm mappers.RegisterForm

	if c.ShouldBindJSON(&registerForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}
	var userRole models.RoleModel
	if registerForm.Org == true {
		organization, err := org.Add(registerForm)
		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
		role := mappers.RoleForm{}
		role.RoleName = "admin"
		role.OrgId = organization.ID
		userRole, err = roleModel.Add(role)
		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
		role.RoleName = "table"
		_, err = roleModel.Add(role)
		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}

		role.RoleName = "kitchen"
		_, err = roleModel.Add(role)
		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}
	}
	registerForm.Role = userRole.ID
	registerForm.OrgId = userRole.OrgId

	_, err := userModel.Register(registerForm)

	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": mappers.Response{Error: nil, Message: "success", ResponseCode: 2000, Data: make([]interface{}, 0)}})
}

func (ctrl Api) RegisterTable(c *gin.Context) {
	var registerForm mappers.RegisterForm

	if c.ShouldBindJSON(&registerForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}
	var userRole models.RoleModel

	userOrg, err := org.Get(registerForm.OrgId)
	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
		c.Abort()
		return
	}
	userRole, err = roleModel.GetRoleForOrg("table", userOrg.ID)
	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	registerForm.Role = userRole.ID
	user, err := userModel.Register(registerForm)

	if err != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully registered", "user": user})
}
