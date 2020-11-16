package utils

import (
	"fmt"
	"net/http"
	"table-booking/config"
	"time"

	"github.com/dgrijalva/jwt-go"
	uuid "github.com/twinj/uuid"
)

type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUUID   string
	RefreshUUID  string
	AtExpires    int64
	RtExpires    int64
}

type AccessDetails struct {
	AccessUUID string
	UserId     string
	RoleId     string
	OrgId      string
}

type Token struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type Auth struct{}

func (m Auth) CreateToken(userId string, userRoleId string, orgId string) (*TokenDetails, error) {

	td := &TokenDetails{}
	td.AtExpires = time.Now().Add(time.Minute * 15).Unix()
	td.AccessUUID = uuid.NewV4().String()

	td.RtExpires = time.Now().Add(time.Minute * 30).Unix()
	td.RefreshUUID = uuid.NewV4().String()

	var err error
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_uuid"] = td.AccessUUID
	atClaims["user_id"] = userId
	atClaims["role_id"] = userRoleId
	atClaims["org_id"] = orgId
	atClaims["exp"] = td.AtExpires

	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)
	td.AccessToken, err = at.SignedString([]byte(config.GetConfig().Secret))
	if err != nil {
		return nil, err
	}
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_uuid"] = td.RefreshUUID
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)
	td.RefreshToken, err = rt.SignedString([]byte(config.GetConfig().Secret))
	if err != nil {
		return nil, err
	}
	return td, nil
}

//ExtractToken ...
func (m Auth) ExtractToken(r *http.Request) string {
	// bearToken := r.Header.Get("Authorization")
	// strArr := strings.Split(bearToken, " ")
	// if len(strArr) == 2 {
	// 	return strArr[1]
	// }
	token, err := r.Cookie("token")
	if err != nil {
		return ""
	}
	return token.Value

}

//VerifyToken ...
func (m Auth) VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := m.ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(config.GetConfig().Secret), nil
	})
	if err != nil {
		return nil, err
	}
	return token, nil
}

//TokenValid ...
func (m Auth) TokenValid(r *http.Request) error {
	token, err := m.VerifyToken(r)
	if err != nil {
		return err
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return err
	}
	return nil
}

//ExtractTokenMetadata ...
func (m Auth) ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
	token, err := m.VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {

		return &AccessDetails{
			AccessUUID: claims["access_uuid"].(string),
			OrgId:      claims["org_id"].(string),
			UserId:     claims["user_id"].(string),
			RoleId:     claims["role_id"].(string),
		}, nil
	}
	return nil, err
}
