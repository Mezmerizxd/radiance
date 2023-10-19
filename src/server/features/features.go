package features

import (
	"radiance/src/server/features/account"
	"radiance/src/server/features/booking"
	"radiance/src/server/features/payment"
)

type Config struct {
	Account account.Account
	Booking booking.Booking
	Payment payment.Payment
}

type Features struct {
	Account account.Account
	Booking booking.Booking
	Payment payment.Payment
}

func New(cfg *Config) Features {
	return Features{
		Account: cfg.Account,
		Booking: cfg.Booking,
		Payment: cfg.Payment,
	}
}

