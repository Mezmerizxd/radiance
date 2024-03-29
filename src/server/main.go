package main

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	v1 "radiance/src/server/api/v1"
	"radiance/src/server/features"
	"radiance/src/server/features/account"
	"radiance/src/server/features/booking"
	"radiance/src/server/features/payment"
	"radiance/src/server/pkg/database"
	"radiance/src/server/pkg/email"
	env "radiance/src/server/pkg/env"
	"radiance/src/server/pkg/server"
)

func main() {
	fmt.Println("Engine startup sequence initiated...")

	/* Env */
	env.InitEnvConfigs()

	go database.Start(env.EnvConfigs.DatabaseHost)

	/* Features */
	featAccount := account.New(&account.Config{})
	featBooking := booking.New(&booking.Config{})
	featPayment := payment.New(&payment.Config{})
	f := features.New(&features.Config{
		Account: featAccount,
		Booking: featBooking,
		Payment: featPayment,
	})

	srv := server.New(env.EnvConfigs.Port, &v1.Config{
		Features: &f,
	})

	/* Email */
	email.InitEmailConfigs()

	quitChannel := make(chan bool, 1)

	go func() {
		if err := srv.Start(); err != nil {
			select {
			case <-quitChannel:
				return
			default:
				fmt.Println("Server: failed to start server: " + err.Error())
			}
		}
	}()

	sc := make(chan os.Signal, 1)
	signal.Notify(sc, syscall.SIGINT, syscall.SIGTERM)
	<-sc
	quitChannel <- true

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	if err := srv.Stop(ctx); err != nil {
		fmt.Println("Server: failed to stop server: " + err.Error())
	}

	database.Stop()
	srv.Stop(ctx)

	fmt.Println("Aborting...")
}
