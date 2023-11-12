package email

func OneTimeCodeTemplate(code string) string {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Email Verification</title>
		<style>
			body {
				font-family: Arial, sans-serif;
			}
			.container {
				width: 100%;
				padding: 20px;
				background-color: #f8f9fa;
			}
			.content {
				max-width: 600px;
				margin: auto;
				background-color: white;
				padding: 20px;
				border-radius: 5px;
			}
			h2 {
				color: #6c757d;
			}
			p {
				color: #6c757d;
			}
			.code {
				font-size: 20px;
				color: #007bff;
				font-weight: bold;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="content">
				<h2>Email Verification</h2>
				<p>Dear User,</p>
				<p>Thank you for signing up. Please verify your email address to activate your account. Your verification code is:</p>
				<p class="code">` + code + `</p>
				<p>Thank you,</p>
				<p>Your Team</p>
			</div>
		</div>
	</body>
	</html>`
}

func EmailVerificationButtonTemplate(code string, url string) string {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Email Verification</title>
		<style>
			body {
				font-family: Arial, sans-serif;
			}
			.container {
				width: 100%;
				padding: 20px;
				background-color: #f8f9fa;
			}
			.content {
				max-width: 600px;
				margin: auto;
				background-color: white;
				padding: 20px;
				border-radius: 5px;
			}
			h2 {
				color: #6c757d;
			}
			p {
				color: #6c757d;
			}
			a.verify-button {
				display: inline-block;
				padding: 10px 20px;
				margin-top: 20px;
				color: white;
				background-color: #007bff;
				text-decoration: none;
				border-radius: 5px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="content">
				<h2>Email Verification</h2>
				<p>Dear User,</p>
				<p>Thank you for signing up. Please verify your email address to activate your account. Click the button below to verify:</p>
				<a href="` + url + `?code=` + code + `" class="verify-button">Verify Email</a>
				<p>Thank you,</p>
				<p>Your Team</p>
			</div>
		</div>
	</body>
	</html>`
}

func ForgotPasswordButtonTemplate(code string, url string) string {
	return `
	<!DOCTYPE html>
	<html>
	<head>
		<title>Forgot Password</title>
		<style>
			body {
				font-family: Arial, sans-serif;
			}
			.container {
				width: 100%;
				padding: 20px;
				background-color: #f8f9fa;
			}
			.content {
				max-width: 600px;
				margin: auto;
				background-color: white;
				padding: 20px;
				border-radius: 5px;
			}
			h2 {
				color: #6c757d;
			}
			p {
				color: #6c757d;
			}
			a.verify-button {
				display: inline-block;
				padding: 10px 20px;
				margin-top: 20px;
				color: white;
				background-color: #007bff;
				text-decoration: none;
				border-radius: 5px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="content">
				<h2>Forgot Password</h2>
				<p>Dear User,</p>
				<p>We received a request to reset your password. Click the button below to reset your password:</p>
				<a href="` + url + `?code=` + code + `" class="verify-button">Reset Password</a>
				<p>Thank you,</p>
				<p>Your Team</p>
			</div>
		</div>
	</body>
	</html>`
}
