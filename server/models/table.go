package models

import (
	"table-booking/config"
	"table-booking/mappers"
	"time"

	uuid "github.com/twinj/uuid"
)

type TableModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"org_id"`
	Active    bool      `db:"active" json:"-"`
	Name      string    `db:"name" json:"name"`
	Occupied  bool      `db:"occupied" json:"occupied"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Table struct{}

func (table Table) Add(tableForm mappers.TableForm) (tableModel TableModel, err error) {

	tableModel.Active = true
	tableModel.ID = uuid.NewV4().String()
	tableModel.Name = tableForm.TableName
	tableModel.CreatedAt = time.Now()
	tableModel.OrgId = tableForm.OrgId
	tableModel.Occupied = false
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

	err = config.GetDB().Where("ID=?", ID).Where("orgId=?", orgId).First(&tableModel).Error
	if err != nil {

		return TableModel{}, err
	}

	return tableModel, err
}

func (table Table) GetTablesForOrg(orgId string) (tableModels []TableModel, err error) {

	err = config.GetDB().Where("orgId=?", orgId).Find(&tableModels).Error
	if err != nil {

		return []TableModel{}, err
	}

	return tableModels, err
}
