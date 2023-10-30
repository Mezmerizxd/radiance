package types

import (
	"errors"
	"time"
)

var (
	ErrorFailedToConnectToDatabase = errors.New("failed to connect to database")
	ErrorFailedToQueryDatabase     = errors.New("failed to query the database")
	ErrorFailedToScanQueryResult   = errors.New("failed to scan query result")
	ErrorFailedToUpdateDatabase    = errors.New("failed to update database")
	ErrorFailedToInsertDatabase    = errors.New("failed to insert database")
)

type AccountSearchParameter int
const (
	ID AccountSearchParameter = iota
	Username
	Email
	Token
	VerifyEmailCode
)

func (p AccountSearchParameter) String() string {
	switch p {
	case ID:
		return "id"
	case Username:
		return "username"
	case Email:
		return "email"
	case Token:
		return "token"
	case VerifyEmailCode:
		return "'verifyEmailCode'"
	default:
		return "unknown"
	}
}

type Account struct {
	ID        string     `json:"id"`
	Email     string     `json:"email"`
	Username  string     `json:"username"`
	Password  string     `json:"password"`
	Token     *string    `json:"token"`
	TokenExp  *time.Time `json:"tokenExp"`
	Role      string      `json:"role"`
	Avatar    *string    `json:"avatar"`
	Biography *string    `json:"biography"`
	VerifiedEmail bool    `json:"verifiedEmail"`
	VerifyEmailCode *string `json:"verifyEmailCode,omitempty"`
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
}

type Profile struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Role      string    `json:"role"`
	Avatar    *string   `json:"avatar,omitempty"`
	Biography *string   `json:"biography,omitempty"`
	VerifiedEmail bool `json:"verifiedEmail"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Booking struct {
	ID          string    `json:"id"`
	Date        time.Time `json:"date"`
	Price       int       `json:"price"`
	ServiceType int    `json:"serviceType"`
	TimeSlot    int 		 `json:"timeSlot"`
	AdditionalNotes string `json:"additionalNotes"`
	Paid        bool      `json:"paid"`
	Confirmed   bool      `json:"confirmed"`
	PaymentIntentID *string `json:"paymentIntentId,omitempty"`
	AddressID   string    `json:"addressId"`
	AccountID   string    `json:"accountId"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Address struct {
	ID          string    `json:"id"`
	Street     	string 		`json:"street"`
	City       	string 		`json:"city"`
	State       string 		`json:"state"`
	Country     string 		`json:"country"`
	PostalCode  string 		`json:"postalCode"`
	AccountID   string    `json:"accountId"`
}