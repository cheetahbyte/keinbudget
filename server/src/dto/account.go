package dto

type AccountCreate struct {
	Name            string  `json:"name" xml:"name" form:"name"`
	Iban            string  `json:"iban" xml:"iban" form:"iban"`
	Balance         float64 `json:"balance" xml:"balance" form:"balance"`
	StartingBalance float64 `json:"starting_balance" xml:"sbalance" form:"sbalance"`
}

type ExternalAccountCreate struct {
	Name string `json:"name" xml:"name" form:"name"`
	Iban string `json:"iban" xml:"iban" form:"iban"`
}
