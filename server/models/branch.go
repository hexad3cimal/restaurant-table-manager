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

func (branch Branch) Add(form mappers.BranchForm) (branchModel BranchModel, err error) {

	if !config.GetDB().Where("name=?", form.Name).Where("org_id=?", form.OrgId).First(&branchModel).RecordNotFound() {

		return BranchModel{}, errors.New("branch name already taken")
	}

	branchModel.Name = form.Name
	branchModel.Address = form.Address
	branchModel.Contact = form.Contact
	branchModel.OrgId = form.OrgId

	branchModel.ID = uuid.NewV4().String()
	err = config.GetDB().Save(&branchModel).Error
	if err != nil {
		return BranchModel{}, err
	}

	return branchModel, err
}

func (branch Branch) Get(id string) (branchModel BranchModel, err error) {

	err = config.GetDB().Where("id=?", id).First(&branchModel).Error
	if err != nil {

		return BranchModel{}, err
	}

	return branchModel, err
}

func (branch Branch) GetBranchesOfOrg(orgId string) (branches []BranchModel, err error) {

	err = config.GetDB().Where("org_id=?", orgId).Find(&branches).Error
	if err != nil {

		return []BranchModel{}, err
	}

	return branches, err
}
