package mappers

type BranchForm struct {
	Name    string `json:"name" binding:"required,max=100"`
	Address string `json:"address"`
	Email   string `json:"email"`
	Contact string `json:"contact"`
	OrgId   string `json:"orgId"`
}

type GetBranchForm struct {
	Name  string `json:"name"`
	OrgId string `json:"orgId"`
}
