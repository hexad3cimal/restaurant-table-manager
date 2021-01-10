package controllers

import (
	"errors"
	"net/http"
	"strings"
	"table-booking/helpers"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
	"github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserController struct{}

func (ctrl UserController) Login(c *gin.Context) {
	var loginForm mappers.LoginForm

	if c.ShouldBindJSON(&loginForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	loggedInUser, loginErr := user.Login(loginForm)
	if loginErr != nil {
		logger.Error(" login failed for " + loginForm.UserName)
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid login details", "error": loginErr.Error()})
		c.Abort()
		return
	}
	if !loggedInUser.Active {
		logger.Error(" In active user " + loginForm.UserName)
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid login details"})
		c.Abort()
		return
	}

	tokenDetails, tokenError := auth.CreateToken()

	if tokenError == nil {
		tokenModel.BranchId = loggedInUser.BranchId
		tokenModel.Email = loggedInUser.Email
		tokenModel.UserId = loggedInUser.ID
		tokenModel.OrgId = loggedInUser.OrgId
		tokenModel.RoleId = loggedInUser.RoleId
		tokenModel.AccessToken = tokenDetails.AccessToken
		tokenModel.RefreshToken = tokenDetails.RefreshToken
		tokenModel.ID = tokenDetails.AccessUUID

		//Add token to db with required details
		_, tokenAddError := token.Add(tokenModel)
		if tokenAddError == nil {
			c.SetCookie("token", tokenDetails.AccessToken, 60*60*23, "/", "localhost", false, true)
			c.SetCookie("refresh-token", tokenDetails.RefreshToken, 60*60*24, "/", "localhost", false, true)
			c.JSON(http.StatusOK, gin.H{"message": "User signed in", "name": loggedInUser.Name, "role": loggedInUser.Role.Name})
			c.Abort()
			return
		}

		logger.Error(" login failed for " + loginForm.UserName)
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid login details", "error": tokenAddError.Error()})
		c.Abort()
		return
	}

	c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid login details", "error": tokenError.Error()})
	c.Abort()
	return
}

func (ctrl UserController) Register(c *gin.Context) {
	var registerForm mappers.RegisterForm

	if c.ShouldBindJSON(&registerForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}
	userModel.Name = registerForm.FullName
	userModel.Email = registerForm.Email
	userModel.Address = registerForm.Address
	userModel.Contact = registerForm.Contact
	userModel.ID = uuid.NewV4().String()
	userModel.OrgId = uuid.NewV4().String()
	userModel.RoleName = "admin"
	roleModel.Name = "admin"
	roleModel.OrgId = userModel.OrgId
	roleModel.ID = uuid.NewV4().String()
	_, roleAddErr := role.Add(roleModel)
	if roleAddErr != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	//create admin user
	userModel.RoleId = roleModel.ID
	userModel.UserName = registerForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(registerForm.UserName)
	userModel.Active = true
	userModel.Locked = false
	bytePassword := []byte(registerForm.Password)
	hashedPassword, passwordHashErr := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if passwordHashErr != nil {
		//delete created admin role
		role.DeleteById(roleModel.ID)
		//delete created organization
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.ID = uuid.NewV4().String()
	adminUser, adminUserAddErr := user.Register(userModel)

	if adminUserAddErr != nil {
		//delete created admin role
		role.DeleteById(roleModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	//add table role
	roleModel.Name = "table"
	roleModel.ID = uuid.NewV4().String()
	tableRole, tableRoleAddErr := role.Add(roleModel)
	if tableRoleAddErr != nil {
		//delete admin user
		user.DeleteById(adminUser.ID)
		//delete created admin role
		role.DeleteById(adminUser.RoleId)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	roleModel.ID = uuid.NewV4().String()
	roleModel.Name = "manager"
	managerRole, managerRoleAddErr := role.Add(roleModel)
	if managerRoleAddErr != nil {
		//delete admin user
		user.DeleteById(adminUser.ID)
		//delete admin role
		role.DeleteById(adminUser.RoleId)
		//delete table role
		role.DeleteById(tableRole.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	roleModel.Name = "kitchen"
	roleModel.ID = uuid.NewV4().String()
	_, kitchenRoleAddErr := role.Add(roleModel)
	if kitchenRoleAddErr != nil {
		//delete admin user
		user.DeleteById(adminUser.ID)
		//delete admin role
		role.DeleteById(adminUser.RoleId)
		//delete table role
		role.DeleteById(tableRole.ID)
		//delete manager role
		role.DeleteById(managerRole.ID)

		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": mappers.Response{Error: nil, Message: "success", ResponseCode: 2000, Data: make([]interface{}, 0)}})
}

func (ctrl UserController) Update(c *gin.Context) {
	var userUpdateForm mappers.UserEditForm
	if c.ShouldBindJSON(&userUpdateForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tokenModel, getTokenError := token.GetTokenById(c.GetHeader("access_uuid"))
	if getTokenError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}

	isAdminOrManager := helpers.AdminOrManagerOfTheOrgAndBranch(tokenModel.UserId, tokenModel.OrgId, tokenModel.BranchId)

	if !isAdminOrManager {
		if userModel.ID != userUpdateForm.ID {
			c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
			c.Abort()
			return
		}
	}
	var userModel models.UserModel
	var getUserError error
	if !isAdminOrManager {
		userModel, getUserError = user.GetUserById(tokenModel.UserId)
	} else {
		userModel, getUserError = user.GetUserById(userUpdateForm.ID)

	}
	if getUserError != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
		c.Abort()
		return
	}
	userModel.UserName = userUpdateForm.UserName
	userModel.UserNameLowerCase = strings.ToLower(userUpdateForm.UserName)
	userModel.Name = userUpdateForm.FullName
	userModel.Email = userUpdateForm.Email
	userModel.LoginCode = userUpdateForm.LoginCode
	_, editUserErr := user.Register(userModel)

	if editUserErr != nil {

		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": mappers.Response{Error: nil, Message: "success", ResponseCode: 2000, Data: make([]interface{}, 0)}})
}

func (ctrl UserController) Validate(c *gin.Context) {
	username, gotUsername := c.GetQuery("username")

	if gotUsername == true {
		_, getUserError := user.GetUserByUsername(strings.ToLower(username))
		if getUserError != nil {
			if errors.Is(getUserError, gorm.ErrRecordNotFound) {
				c.JSON(http.StatusOK, gin.H{"data": true})
				c.Abort()
				return
			}
		}
		id, gotEdit := c.GetQuery("edit")
		if gotEdit {
			userModel, _ := user.GetUserById(id)
			if userModel.UserName == username {
				c.JSON(http.StatusOK, gin.H{"data": true})
				c.Abort()
				return
			}
		}

		c.JSON(http.StatusOK, gin.H{"data": false})
		c.Abort()
		return
	}
	email, gotEmail := c.GetQuery("email")
	if gotEmail == true {
		_, getEmailError := user.GetUserByEmail(email)
		if getEmailError == nil {
			c.JSON(http.StatusOK, gin.H{"data": false})
			c.Abort()
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": true})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": false})
}
