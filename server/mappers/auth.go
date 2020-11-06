package mappers

type LoginForm struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type RegisterForm struct {
	FullName string `json:"name" binding:"required,max=100"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
	Org      bool   `json:"org" binding:"required"`
	OrgId    string `json:"orgId"`
	Role     string `json:"role"`
}
