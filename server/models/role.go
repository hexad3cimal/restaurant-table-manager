package models

import (
	"table-booking/config"
	"table-booking/mappers"
	"time"

	uuid "github.com/twinj/uuid"
)

type RoleModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"org_id"`
	Active    bool      `db:"active" json:"-"`
	Name      string    `db:"name" json:"name"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Role struct{}

func (role Role) Add(roleForm mappers.RoleForm) (roleModel RoleModel, err error) {

	err = config.GetDB().Where("WHERE name=LOWER($1)", roleForm.RoleName).First(&roleModel).Error
	if err != nil {

		return RoleModel{}, err
	}

	roleModel.Active = true
	roleModel.ID = uuid.NewV4().String()
	roleModel.Name = roleForm.RoleName
	roleModel.CreatedAt = time.Now()
	roleModel.OrgId = roleForm.OrgId
	err = config.GetDB().Save(&roleModel).Error
	if err != nil {
		return RoleModel{}, err
	}

	return roleModel, err
}

func (role Role) Get(id string) (roleModel RoleModel, err error) {

	err = config.GetDB().Where("WHERE id=LOWER($1) LIMIT 1", id).First(&roleModel).Error
	if err != nil {

		return RoleModel{}, err
	}

	return roleModel, err
}
