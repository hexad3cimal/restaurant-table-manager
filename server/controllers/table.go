package controllers

import (
	"net/http"
	"table-booking/mappers"
	"table-booking/models"

	"github.com/gin-gonic/gin"
)

type TableController struct{}

var tableModel = new(models.Table)

func (ctrl TableController) Add(c *gin.Context) {
	var tableForm mappers.TableForm

	if c.ShouldBindJSON(&tableForm) != nil {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "Invalid form"})
		c.Abort()
		return
	}

	_, err := tableModel.Add(tableForm)
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

	tables, err := tableModel.GetTablesForOrg(tableForm.OrgId)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"message": "success", "data": tables})
	} else {
		c.JSON(http.StatusNotAcceptable, gin.H{"message": "error"})
	}

}
