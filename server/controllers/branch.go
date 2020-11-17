package controllers

import (
	"net/http"
	"table-booking/mappers"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
	"golang.org/x/crypto/bcrypt"
)

type BranchController struct{}

func (ctrl BranchController) Add(c *gin.Context) {
	var branchForm mappers.RegisterForm

	if c.ShouldBindJSON(&branchForm) != nil {
		logger.Error("inavlid branch form ")

		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	branchModel.Address = branchForm.Address
	branchModel.Contact = branchForm.Contact
	branchModel.Email = branchForm.Email
	branchModel.Name = branchForm.FullName
	branchModel.OrgId = c.GetHeader("org_id")
	branchModel.ID = uuid.NewV4().String()
	_, branchAddErr := branch.Add(branchModel)
	if branchAddErr != nil {
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

	//get branch role for current organisation
	roleModel, roleGetError := role.GetRoleForOrg("branch", branchModel.OrgId)
	if roleGetError != nil {
		branch.DeleteBranchById(branchModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}

	//add new user with branch role
	userModel.RoleId = roleModel.ID
	userModel.OrgId = branchModel.OrgId
	bytePassword := []byte(branchForm.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		branch.DeleteBranchById(branchModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}
	userModel.Name = branchForm.FullName
	userModel.Email = branchForm.Email
	userModel.Password = hashedPassword
	userModel.ForgotPasswordCode = uuid.NewV4().String()
	userModel.ID = uuid.NewV4().String()
	_, userError := user.Register(userModel)

	if userError != nil {
		branch.DeleteBranchById(branchModel.ID)
		c.JSON(http.StatusExpectationFailed, gin.H{"message": "error"})
	}
	c.JSON(http.StatusAccepted, gin.H{"message": "success"})
}

func (ctrl BranchController) GetBranchesOfOrg(c *gin.Context) {
	branches, err := branch.GetBranchesOfOrg(c.GetHeader("orgId"))
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}
