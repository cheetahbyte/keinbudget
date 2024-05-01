package dto

type AccountCreate struct {
	Name string `json:"name" xml:"name" form:"name"`
	Iban string `json:"iban" xml:"iban" form:"iban"`
}

type ExternalAccountCreate struct {
	Name string `json:"name" xml:"name" form:"name"`
	Iban string `json:"iban" xml:"iban" form:"iban"`
}
