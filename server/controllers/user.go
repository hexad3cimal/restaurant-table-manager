package controllers

import (
	"net/http"
	"table-booking/mappers"
	"table-booking/models"
	"table-booking/utils"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type UserController struct{}

var org = new(models.Organization)
var auth = new(utils.Auth)

func (ctrl UserController) Login(c *gin.Context) {
	var loginForm mappers.LoginForm

	if c.ShouldBindJSON(&loginForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	loggerInUser, err := user.Login(loginForm)

	tokenDetails, err := auth.CreateToken(loggerInUser.ID, loggerInUser.RoleId, loggerInUser.OrgId)

	if err == nil {
		c.SetCookie("token", tokenDetails.AccessToken, 300, "/", "localhost", false, true)
		c.SetCookie("refresh-token", tokenDetails.RefreshToken, 60*60*24, "/", "localhost", false, true)
		c.JSON(http.StatusOK, gin.H{"message": "User signed in", "name": loggerInUser.Name})
		// c.JSON(http.StatusOK, gin.H{"message": "User signed in", "name": user.Name, "token": token.AccessToken, "refresh-token": token.RefreshToken})
	} else {
		logger.Error(" login failed for " + loginForm.Email)
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid login details", "error": err.Error()})
	}

}

func (ctrl UserController) Register(c *gin.Context) {
	var registerForm mappers.RegisterForm
	var roleModel models.RoleModel
	var organization models.OrganizationModel
	var userModel models.UserModel

	if c.ShouldBindJSON(&registerForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}
	organization.Name = registerForm.FullName
	organization.Email = registerForm.Email
	organization.Address = registerForm.Address
	organization.Contact = registerForm.Contact
	organization.ID = uuid.NewV4().String()
	addedOrganization, addOrgError := org.Add(organization)
	if addOrgError != nil {
		logger.Error(" Add org failed for email "+organization.Email+" and name "+organization.Name, addOrgError.Error)
		c.JSON(http.StatusNotAcceptable, gin.H{"message": addOrgError.Error()})
		c.Abort()
		return
	}

	//add admin role
	roleModel.Name = "admin"
	roleModel.OrgId = addedOrganization.ID
	roleModel.ID = uuid.NewV4().String()
	_, roleAddErr := role.Add(roleModel)
	if roleAddErr != nil {
		org.DeleteById(addedOrganization.ID)

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	//create admin user
	userModel.RoleId = roleModel.ID
	userModel.OrgId = addedOrganization.ID
	bytePassword := []byte(registerForm.Password)
	hashedPassword, passwordHashErr := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if passwordHashErr != nil {
		//delete created admin role
		role.DeleteById(roleModel.ID)
		//delete created organization
		org.DeleteById(addedOrganization.ID)

		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}

	userModel.Name = registerForm.FullName
	userModel.Email = registerForm.Email
	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.ID = uuid.NewV4().String()
	adminUser, adminUserAddErr := user.Register(userModel)

	if adminUserAddErr != nil {

		//delete created admin role
		role.DeleteById(roleModel.ID)
		//delete created organization
		org.DeleteById(addedOrganization.ID)

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
		//delete created organization
		org.DeleteById(addedOrganization.ID)

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
		//delete organization
		org.DeleteById(addedOrganization.ID)

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
		//delete organization
		org.DeleteById(addedOrganization.ID)

		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error occured"})
		c.Abort()
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": mappers.Response{Error: nil, Message: "success", ResponseCode: 2000, Data: make([]interface{}, 0)}})
}
