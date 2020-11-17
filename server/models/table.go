package models

import (
	"table-booking/config"
	"time"
)

type TableModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"org_id"`
	BranchId  string    `db:"branch_id" json:"branch_id"`
	Active    bool      `db:"active" json:"-"`
	Name      string    `db:"name" json:"name"`
	Occupied  bool      `db:"occupied" json:"occupied"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Table struct{}

func (table Table) Add(tableModel TableModel) (returnModel TableModel, err error) {

	err = config.GetDB().Save(&tableModel).Error
	if err != nil {
		return TableModel{}, err
	}

	return tableModel, err
}

func (table Table) Get(id string) (tableModel TableModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&tableModel).Error
	if err != nil {

		return TableModel{}, err
	}

	return tableModel, err
}

func (table Table) GetTableForOrg(ID string, orgId string) (tableModel TableModel, err error) {

	err = config.GetDB().Where("ID=?", ID).Where("org_id=?", orgId).First(&tableModel).Error
	if err != nil {

		return TableModel{}, err
	}

	return tableModel, err
}

func (table Table) GetTablesOfOrg(orgId string) (tableModels []TableModel, err error) {

	err = config.GetDB().Where("org_id=?", orgId).Find(&tableModels).Error
	if err != nil {

		return []TableModel{}, err
	}

	return tableModels, err
}

func (table Table) GetTableOfBranch(ID string, branchId string) (tableModel TableModel, err error) {

	err = config.GetDB().Where("ID=?", ID).Where("branch_id=?", branchId).First(&tableModel).Error
	if err != nil {

		return TableModel{}, err
	}

	return tableModel, err
}

func (table Table) GetTablesOfBranch(branchId string) (tableModels []TableModel, err error) {

	err = config.GetDB().Where("branch_id=?", branchId).Find(&tableModels).Error
	if err != nil {

		return []TableModel{}, err
	}

	return tableModels, err
}
