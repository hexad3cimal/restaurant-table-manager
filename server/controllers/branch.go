package controllers

import (
	"net/http"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
)

type BranchController struct{}

var branchModel = new(models.Branch)

func (ctrl BranchController) Add(c *gin.Context) {
	var branchForm mappers.BranchForm

	if c.ShouldBindJSON(&branchForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	_, err := branchModel.Add(branchForm)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}

func (ctrl BranchController) GetBranchesOfOrg(c *gin.Context) {
	branches, err := branchModel.GetBranchesOfOrg(c.GetHeader("orgId"))
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": branches})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}
