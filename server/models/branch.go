package models

import (
	"errors"
	"table-booking/config"
	"table-booking/mappers"
	"time"

	uuid "github.com/twinj/uuid"
)

type BranchModel struct {
	ID        string    `db:"id, primarykey" json:"id"`
	OrgId     string    `db:"org_id" json:"orgId"`
	Name      string    `db:"name" json:"name"`
	Email     string    `db:"email" json:"email"`
	Address   string    `db:"name" json:"address"`
	Contact   string    `db:"contact" json:"contact"`
	UpdatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}

type Branch struct{}

func (org Branch) Add(form mappers.BranchForm) (branch BranchModel, err error) {

	if !config.GetDB().Where("name=?", form.Name).Where("orgId=?", form.OrgId).First(&branch).RecordNotFound() {

		return BranchModel{}, errors.New("branch name already taken")
	}

	branch.Name = form.Name
	branch.Address = form.Address
	branch.Contact = form.Contact
	branch.OrgId = form.OrgId

	branch.ID = uuid.NewV4().String()
	err = config.GetDB().Save(&branch).Error
	if err != nil {
		return BranchModel{}, err
	}

	return branch, err
}

func (org Branch) Get(id string) (branch BranchModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&branch).Error
	if err != nil {

		return BranchModel{}, err
	}

	return branch, err
}

func (org Branch) GetBranchesOfOrg(orgId string) (branches []BranchModel, err error) {

	err = config.GetDB().Where("orgId=?", orgId).Find(&branches).Error
	if err != nil {

		return []BranchModel{}, err
	}

	return branches, err
}
