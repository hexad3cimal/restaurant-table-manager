package models

import (
	"errors"
	"table-booking/config"
	"table-booking/mappers"
	"time"

	"github.com/twinj/uuid"
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

	tokenDetails, err := authModel.CreateToken(user.Email)

	if err == nil {
		token.AccessToken = tokenDetails.AccessToken
		token.RefreshToken = tokenDetails.RefreshToken
	}

	return user, token, nil
}

func (u User) Register(form mappers.RegisterForm) (user UserModel, err error) {

	if !config.GetDB().Where("email=?", form.Email).First(&u).RecordNotFound() {

		return UserModel{}, errors.New("email already taken")
	}

	bytePassword := []byte(form.Password)
	hashedPassword, err := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	if err != nil {
		panic(err) //Something really went wrong here...
	}

	user.Name = form.FullName
	user.Email = form.Email
	user.Password = hashedPassword
	user.ForgotPasswordCode = uuid.NewV4().String()
	user.RoleId = form.Role
	user.OrgId = form.OrgId
	err = config.GetDB().Save(&u).Error
	if err != nil {
		return UserModel{}, err
	}

	return user, err
}
