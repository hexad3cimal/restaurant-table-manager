package controllers

import (
	"errors"
	"net/http"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Api struct{}

var userModel = new(models.User)
var org = new(models.Organization)
var role = new(models.Role)

func (ctrl Api) Login(c *gin.Context) {
	var loginForm mappers.LoginForm

	if c.ShouldBindJSON(&loginForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	user, token, err := userModel.Login(loginForm)
	if err == nil {
		c.SetCookie("token", token.AccessToken, 300, "/", "localhost", false, true)
		c.SetCookie("refresh-token", token.RefreshToken, 60*60*24, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{"message": "User signed in", "name": user.Name})
		// c.JSON(http.StatusOK, gin.H{"message": "User signed in", "name": user.Name, "token": token.AccessToken, "refresh-token": token.RefreshToken})
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
	if registerForm.Org == true {

		var organization models.OrganizationModel
		organization.Name = registerForm.FullName
		organization.Email = registerForm.Email
		organization.Address = registerForm.Address
		organization.Contact = registerForm.Contact
		organization.ID = uuid.NewV4().String()
		addedOrganization, err := org.Add(organization)
		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}

		roleModel models.RoleModel{}

		//add admin role
		roleModel.Name = "admin"
		roleModel.OrgId = addedOrganization.ID
		roleModel.ID = uuid.NewV4().String()
		_, err = role.Add(roleModel)
		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}

		//create admin user
		var user models.UserModel
		user.RoleId = role.ID
		user.OrgId = addedOrganization.ID
		bytePassword := []byte(registerForm.Password)
		hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
		if err != nil {
			//delete created admin role
			role
			//delete created organization
			org.DeleteById(addedOrganization.ID)
			return UserModel{}, errors.New("error occured while password hash generation")
		}

		user.Name = registerForm.FullName
		user.Email = registerForm.Email
		user.Password = hashedPassword
		user.ForgotPasswordCode = uuid.NewV4().String()
		user.ID = uuid.NewV4().String()
		_, err := userModel.Register(user)

		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}

		//add table role
		role.RoleName = "table"
		role.ID = uuid.NewV4().String()
		_, err = roleModel.Add(role)
		if err != nil {
			c.JSON(http.StatusNotAcceptable, gin.H{"message": err.Error()})
			c.Abort()
			return
		}

		role.RoleName = "manager"
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

	c.JSON(http.StatusOK, gin.H{"data": mappers.Response{Error: nil, Message: "success", ResponseCode: 2000, Data: make([]interface{}, 0)}})
}
