package models

import (
	"table-booking/config"
	"time"
)

type RoleModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"org_id"`
	Active    bool      `db:"active" json:"-" sql:"DEFAULT:true"`
	Name      string    `db:"name" json:"name"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Role struct{}

func (role Role) Add(roleModel RoleModel) (returnModel RoleModel, err error) {

	err = config.GetDB().Save(&roleModel).Error
	if err != nil {
		return RoleModel{}, err
	}

	return roleModel, err
}

func (role Role) DeleteById(id string) (returnModel RoleModel, err error) {

	err = config.GetDB().Where("id=?", id).Delete(&returnModel).Error

	if err != nil {
		return RoleModel{}, err
	}

	return returnModel, err
}

func (role Role) Get(id string) (roleModel RoleModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&roleModel).Error
	if err != nil {

		return RoleModel{}, err
	}

	return roleModel, err
}

func (role Role) GetRoleByNameAndOrgId(roleName string, orgId string) (roleModel RoleModel, err error) {

	err = config.GetDB().Where("name=?", roleName).Where("org_id=?", orgId).First(&roleModel).Error
	if err != nil {

		return RoleModel{}, err
	}

	return roleModel, err
}

func (role Role) GetRoleByIdAndOrg(roleId string, orgId string) (roleModel RoleModel, err error) {

	err = config.GetDB().Where("id=?", roleId).Where("org_id=?", orgId).First(&roleModel).Error
	if err != nil {

		return RoleModel{}, err
	}

	return roleModel, err
}
