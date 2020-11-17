package controllers

import (
	"net/http"
	"table-booking/mappers"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/twinj/uuid"
)

type TableController struct{}

func (ctrl TableController) Add(c *gin.Context) {
	var tableForm mappers.TableForm

	if c.ShouldBindJSON(&tableForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tableModel.Active = true
	tableModel.ID = uuid.NewV4().String()
	tableModel.Name = tableForm.TableName
	tableModel.CreatedAt = time.Now()
	tableModel.OrgId = c.GetHeader("org_id")
	tableModel.BranchId = tableForm.BranchId
	tableModel.Occupied = false
	_, err := table.Add(tableModel)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success"})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}

func (ctrl TableController) GetTablesOfOrg(c *gin.Context) {
	var tableForm mappers.GetTableForm

	if c.ShouldBindJSON(&tableForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tables, err := table.GetTablesOfOrg(tableForm.OrgId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}

func (ctrl TableController) GetTablesOfBranch(c *gin.Context) {
	var tableForm mappers.GetTableForm

	if c.ShouldBindJSON(&tableForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	tables, err := table.GetTablesOfBranch(tableForm.BranchId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}
