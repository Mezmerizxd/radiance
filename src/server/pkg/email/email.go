package email

import (
	"radiance/src/server/pkg/env"

	"gopkg.in/gomail.v2"
)

var (
	EmailUsername string
	EmailPassword string
)

func InitEmailConfigs() {
	EmailUsername = env.EnvConfigs.EmailUsername
	EmailPassword = env.EnvConfigs.EmailPassword

	if EmailUsername == "" || EmailPassword == "" {
		panic("Email: failed to load email variables")
	}
}

func SendEmail(to, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", EmailUsername)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer("smtp.gmail.com", 587, EmailUsername, EmailPassword)

	if err := d.DialAndSend(m); err != nil {
		return err
	}
	return nil
}

func SendEmailVerification(to, code string) error {
	var url string
	if env.EnvConfigs.Mode == "production" {
		url = "https://radiance-mu.vercel.app/verify"
	} else {
		url = "http://localhost:8080/verify"
	}

	body := EmailVerificationButtonTemplate(code, url)
	return SendEmail(to, "Email Verification", body)
}

func SendForgotPasswordCode(to, code string) error {
	var url string
	if env.EnvConfigs.Mode == "production" {
		url = "https://radiance-mu.vercel.app/auth/reset-password"
	} else {
		url = "http://localhost:8080/auth/reset-password"
	}

	body := ForgotPasswordButtonTemplate(code, url)
	return SendEmail(to, "Reset Password", body)
}