package models

import (
	"errors"
	"table-booking/config"
	"table-booking/mappers"

	"time"

	"golang.org/x/crypto/bcrypt"
)

type UserModel struct {
	ID                 string    `db:"id, primarykey" json:"id"`
	Email              string    `db:"email" json:"email"`
	OrgId              string    `db:"org_id" json:"orgId"`
	BranchId           string    `db:"branch_id" json:"branchId"`
	RoleId             string    `db:"role_id" json:"roleId"`
	Password           []byte    `db:"password" json:"-"`
	ForgotPasswordCode string    `db:"forgot_password" json:"-"`
	Active             bool      `db:"active" json:"-"`
	Locked             bool      `db:"locked" json:"-"`
	LockedUntil        time.Time `db:"locked_until" json:"-"`
	Name               string    `db:"name" json:"name"`
	UserName           string    `db:"user_name" json:"userName"`
	UserNameLowerCase  string    `db:"user_name_lower" json:"userNameLower"`
	UpdatedAt          time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt          time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}
type User struct {
}

func (m User) Login(form mappers.LoginForm) (user UserModel, err error) {

	config.GetDB().Where("user_name=?", form.UserName).First(&user)

	bytePassword := []byte(form.Password)
	byteHashedPassword := []byte(user.Password)

	err = bcrypt.CompareHashAndPassword(byteHashedPassword, bytePassword)

	if err != nil {
		return user, errors.New("invalid password")
	}

	if user.Locked == true {
		return user, errors.New("user is locked")
	}

	return user, nil
}

func (u User) EmailTaken(email string) (status bool, err error) {
	var user UserModel
	if !config.GetDB().Where("email=?", email).First(&user).RecordNotFound() {

		return false, errors.New("email already taken")
	}
	return true, nil
}

func (u User) Register(user UserModel) (addedUser UserModel, err error) {

	err = config.GetDB().Save(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, err
}

func (u User) GetUserById(userId string) (user UserModel, err error) {
	err = config.GetDB().Where("ID=?", userId).First(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, nil
}

func (u User) GetUserByUsername(userName string) (user UserModel, err error) {
	err = config.GetDB().Where("user_name_lower=?", userName).First(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, nil
}

func (u User) GetUserByEmail(email string) (user UserModel, err error) {
	err = config.GetDB().Where("email=?", email).First(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, nil
}

func (u User) GetUserByBranchId(branchId string) (user UserModel, err error) {
	err = config.GetDB().Where("branch_id=?", branchId).First(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, nil
}

func (u User) DeleteById(userId string) (user UserModel, err error) {
	err = config.GetDB().Where("ID=?", userId).Delete(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, nil
}
