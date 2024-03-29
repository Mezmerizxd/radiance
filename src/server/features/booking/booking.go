package booking

import (
	"fmt"
	"radiance/src/server/pkg/database"
	"radiance/src/server/types"
	"time"

	"github.com/google/uuid"
)

type Config struct{}

type Booking interface {
	Create(data types.CreateBooking, account types.Account) (*types.Booking, error)
	Cancel(bookingID string, account types.Account) (error)
	IsDateBooked(date time.Time) (bool, error)
	ConfirmBooking(bookingID string) (*types.Booking, error)
	ConfirmBookingPayment(bookingID string) (*types.Booking, error)
	RescheduleConfirmedBooking(bookingID string, date time.Time) (*types.Booking, error)
	RescheduleBooking(data types.RescheduleConfirmedBooking) (*types.Booking, error)
}

type booking struct{}

func New(cfg *Config) Booking {
	return &booking{}
}

func (b *booking) Create(data types.CreateBooking, account types.Account) (*types.Booking, error) {
	booked, err := b.IsDateBooked(data.Date)
	if err != nil {
		return nil, err
	}

	if booked {
		return nil, types.ErrorDateAlreadyBooked
	}

	var price = 0
	switch data.ServiceType {
	case 0:
		price = 30
	case 1:
		price = 45
	case 2:
		price = 60
	}

	booking := types.Booking{
		ID:        uuid.New().String(),
		Date:      data.Date,
		Price:     price,
		ServiceType: data.ServiceType,
		Paid: 		false,
		Confirmed: false,
		TimeSlot: data.TimeSlot,
		AdditionalNotes: data.AdditionalNotes,
		AddressID: data.AddressID,
		AccountID: account.ID,
		CreatedAt: time.Now(),
	}

	err = database.CreateBooking(booking)
	if err != nil {
		return nil, err
	}

	return &booking, nil
}

func (b *booking) Cancel(bookingID string, account types.Account) (error) {
	booking, err := database.GetBookingByID(bookingID)
	if err != nil {
		return err
	}

	if booking.AccountID != account.ID {
		return types.ErrorYouDoNotOwnThisBooking
	}

	if booking.Confirmed {
		return types.ErrorThisBookingIsConfirmed
	}

	err = database.DeleteBookingByID(bookingID)
	if err != nil {
		return err
	}

	return nil
}

func (b *booking) IsDateBooked(date time.Time) (bool, error) {
	bookings, err := database.GetAllBookings()
	if err != nil {
		return false, err
	}

	for _, booking := range *bookings {
		if booking.Date == date {
			return true, nil
		}

		if booking.Date.Day() == date.Day() && booking.Date.Month() == date.Month() && booking.Date.Year() == date.Year() {
			return true, nil
		}
	}

	return false, nil
}

func (b *booking) ConfirmBooking(bookingID string) (*types.Booking, error) {
	booking, err := database.GetBookingByID(bookingID)
	if err != nil {
		return nil, err
	}

	booking.Confirmed = true

	err = database.UpdateBooking(*booking)
	if err != nil {
		fmt.Println("Features:", err)
		return nil, err
	}

	return booking, nil
}

func (b *booking) ConfirmBookingPayment(bookingID string) (*types.Booking, error) {
	booking, err := database.GetBookingByID(bookingID)
	if err != nil {
		return nil, err
	}

	booking.Paid = true

	err = database.UpdateBooking(*booking)
	if err != nil {
		return nil, err
	}

	return booking, nil
}

func (b *booking) RescheduleConfirmedBooking(bookingID string, date time.Time) (*types.Booking, error) {
	booked, err := b.IsDateBooked(date)
	if err != nil {
		return nil, err
	}

	if booked {
		return nil, types.ErrorDateAlreadyBooked
	}

	booking, err := database.GetBookingByID(bookingID)
	if err != nil {
		return nil, err
	}

	booking.Date = date

	err = database.UpdateBooking(*booking)
	if err != nil {
		return nil, err
	}

	return booking, nil
}

func (b *booking) RescheduleBooking(data types.RescheduleConfirmedBooking) (*types.Booking, error) {
	booking, err := database.GetBookingByID(data.BookingID)
	if err != nil {
		return nil, err
	}

	booking.Date = data.Date
	booking.TimeSlot = data.TimeSlot
	booking.Confirmed = false

	err = database.UpdateBooking(*booking)
	if err != nil {
		return nil, err
	}

	return booking, nil
}