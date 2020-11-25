package mappers

type LoginForm struct {
	UserName string `json:"userName" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RegisterForm struct {
	UserName string `json:"userName" binding:"required,max=100"`
	FullName string `json:"name"`
	Address  string `json:"address"`
	Contact  string `json:"contact"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
	OrgId    string `json:"orgId"`
	Role     string `json:"role"`
}
