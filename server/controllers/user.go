package controllers

import (
	"net/http"
	"reflect"
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
		c.JSON(http.StatusOK, gin.H{"message": "User signed in", "user": user, "token": token})
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
	}
	if reflect.ValueOf(userRole).IsZero() {
		userOrg, err := org.GetByCode(registerForm.OrgId)
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
