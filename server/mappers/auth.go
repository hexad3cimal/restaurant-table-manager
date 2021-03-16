package mappers

type LoginForm struct {
	UserName string `json:"userName" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterForm struct {
	UserName string `json:"newUserName" binding:"required,max=100"`
	FullName string `json:"name"`
	Address  string `json:"address"`
	Contact  string `json:"contact"`
	Email    string `json:"newEmail" binding:"required,email"`
	Password string `json:"newPassword" binding:"required"`
	OrgId    string `json:"orgId"`
	Role     string `json:"role"`
}

type UserEditForm struct {
	ID        string `json:"id"`
	UserName  string `json:"userName"`
	FullName  string `json:"name"`
	Address   string `json:"address"`
	Contact   string `json:"contact"`
	Email     string `json:"email""`
	LoginCode string `json:"loginCode"`
	Password  string `json:"newPassword"`
}
