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
	OrgId              string    `db:"orgId" json:"orgId"`
	RoleId             string    `db:"roleId" json:"roleId"`
	Password           []byte    `db:"password" json:"-"`
	ForgotPasswordCode string    `db:"forgot_password" json:"-"`
	Active             bool      `db:"active" json:"-"`
	Locked             bool      `db:"locked" json:"-"`
	LockedUntil        time.Time `db:"locked_until" json:"-"`
	Name               string    `db:"name" json:"name"`
	UpdatedAt          time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
	CreatedAt          time.Time `db:"updated_at" json:"-" sql:"DEFAULT:current_timestamp"`
}
type User struct {
}

var authModel = new(AuthModel)

func (m User) Login(form mappers.LoginForm) (user UserModel, token Token, err error) {

	config.GetDB().Where("email=?", form.Email).First(&user)

	bytePassword := []byte(form.Password)
	byteHashedPassword := []byte(user.Password)

	err = bcrypt.CompareHashAndPassword(byteHashedPassword, bytePassword)

	if err != nil {
		return user, token, errors.New("invalid password")
	}

	if user.Locked == true {
		return user, token, errors.New("user is locked")
	}
	tokenDetails, err := authModel.CreateToken(user)

	if err == nil {
		token.AccessToken = tokenDetails.AccessToken
		token.RefreshToken = tokenDetails.RefreshToken
	}

	return user, token, nil
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
	config.GetDB().Where("ID=?", userId).First(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, nil
}

func (u User) DeleteById(userId string) (user UserModel, err error) {
	config.GetDB().Where("ID=?", userId).Delete(&user).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, nil
}
