package mappers

type ConfigForm struct {
	Id             string `json:"id" binding:"required,max=36"`
	Currency       string `json:"currency"`
	TimeZone       string `json:"timeZone"`
	Language       string `json:"language"`
	Country        string `json:"country"`
	PrinterEnabled bool   `json:"printerEnabled"`
}
