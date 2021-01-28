package models

import (
	"fmt"
	"table-booking/config"
)

type DashBoardStats struct {
	Count string `json:"count"`
	Sum   string `json:"cost"`
}

type DashBoard struct{}

func (dashBoard DashBoard) GetStatsForOrg(orgId string) (returnModel []DashBoardStats, err error) {
	rows, err := config.GetDB().Raw("SELECT count(order_models.id), SUM(order_models.price) FROM order_models WHERE order_models.org_id = ? UNION SELECT count(product_models.id), SUM(product_models.price) FROM product_models WHERE product_models.org_id = ?", orgId, orgId).Rows()
	if err != nil {
		fmt.Println(err)
		return returnModel, err

	}
	defer rows.Close()
	for rows.Next() {
		var stats DashBoardStats
		config.GetDB().ScanRows(rows, &stats)
		returnModel = append(returnModel, stats)
	}
	return returnModel, nil
}

func (dashBoard DashBoard) GetStatsForBranch(branchId string) (returnModel []DashBoardStats, err error) {
	rows, err := config.GetDB().Raw("SELECT count(order_models.id), SUM(order_models.price) FROM order_models WHERE order_models.branch_id = ? UNION SELECT count(product_models.id), SUM(product_models.price) FROM product_models WHERE product_models.branch_id = ?", branchId, branchId).Rows()
	defer rows.Close()
	for rows.Next() {
		var stats DashBoardStats
		config.GetDB().ScanRows(rows, &stats)
		returnModel = append(returnModel, stats)
	}
	return returnModel, nil
}
