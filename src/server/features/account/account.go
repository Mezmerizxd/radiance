package account

import (
	"errors"
	"radiance/src/server/pkg/database"
	"radiance/src/server/pkg/email"
	"radiance/src/server/pkg/utils"
	types "radiance/src/server/types"
	"time"

	"github.com/google/uuid"
)

type Config struct{}

type Account interface {
	Login(data types.LoginAccountData) (*types.Account, error)
	Create(data types.CreateAccountData) (*types.Account, error)
	Delete(data types.DeleteAccountData) (error)
	GenerateToken() (*types.TokenData, error)
	ValidateToken(account types.Account) (bool, error)
	HasAccess(account types.Account, role string) (bool, error)
	GetProfile(token string) (*types.Profile, error)
	UpdateProfile(account *types.Account, data *types.Profile) (*types.Profile, error)
	GetAddresses(account types.Account) ([]types.Address, error)
	UpdateAddress(account types.Account, data types.Address) (*types.Address, error)
	CreateAddress(account types.Account, data types.Address) (*types.Address, error)
	UpdatePassword(account types.Account, data types.UpdatePasswordData) (error)
	VerifyEmail(code string) (error)
	ToggleTwoFactor(account types.Account, enabled bool) (error)
	ForgotPassword(email string) (bool, error)
	ResetPassword(code string, password string) (error)
}

type account struct{}

func New(cfg *Config) Account {
	return &account{}
}

func (a *account) Login(data types.LoginAccountData) (*types.Account, error) {
	account, err := database.GetAccountByUsername(data.Username)
	if err != nil {
		return nil, err
	}

	hashedPassword := utils.StringToSha512(data.Password)
	if hashedPassword != account.Password {
		return nil, types.ErrorPasswordsDoNotMatch
	}

	access, err2 := a.GenerateToken()
	if err2 != nil {
		return nil, err2
	}

	account.Token = &access.Token
	account.TokenExp = &access.TokenExp

	err3 := database.UpdateAccount(*account)
	if err3 != nil {
		return nil, err3
	}

	return account, nil
}

func (a *account) Create(data types.CreateAccountData) (*types.Account, error) {
	if len(data.Email) < 1 {
		return nil, types.ErrorEmailLength
	} else if len(data.Username) < 1 {
		return nil, types.ErrorUsernameLength
	}

	_, err := database.GetAccountByEmail(data.Email)
	if err == nil {
		return nil, types.ErrorEmailUsed
	}

	_, err = database.GetAccountByUsername(data.Username)
	if err == nil {
		return nil, types.ErrorUsernameTaken
	}

	hashedPassword := utils.StringToSha512(data.Password)

	access, err := a.GenerateToken()
	if err != nil {
		return nil, err
	}

	verifyCode, err := a.GenerateToken()
	if err != nil {
		return nil, err
	}

	err = email.SendEmailVerification(data.Email, verifyCode.Token)
	if err != nil {
		return nil, err
	}

	newAccount := types.Account{
		ID: uuid.New().String(),
		Email: data.Email,
		Username: data.Username,
		Password: hashedPassword,
		Token: &access.Token,
		TokenExp: &access.TokenExp,
		Role: "USER",
		VerifyEmailCode: &verifyCode.Token,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	err = database.CreateAccount(newAccount)
	if err != nil {
		return nil, types.ErrorFailedToCreateAccount
	}

	return &newAccount, nil
}

func (a *account) Delete(data types.DeleteAccountData) (error) {
	switch data.Identifier {
	case "id":
		err := database.DeleteAccountByID(data.Value)
		if err != nil {
			return err
		}
	case "username":
		err := database.DeleteAccountByUsername(data.Value)
		if err != nil {
			return err
		}
	case "email":
		err := database.DeleteAccountByEmail(data.Value)
		if err != nil {
			return err
		}
	case "token":
		err := database.DeleteAccountByToken(data.Value)
		if err != nil {
			return err
		}
	default:
		return types.ErrorInvalidIdentifier
	}

	return nil
}

func (a *account) GenerateToken() (*types.TokenData, error) {
	var attempts = 5
	var generated = false
	
	token := utils.GenerateToken()

	for i := 0; i < attempts; i++ {
		acc, _ := database.GetAccountByToken(token)

		if acc != nil {
			token = utils.GenerateToken()
		} else {
			generated = true
			break
		}
	}

	if !generated {
		return nil, types.ErrorFailedToGenerateAccess
	}

	expiry := time.Now().Add(24 * time.Hour)

	return &types.TokenData{
		Token: token,
		TokenExp: expiry,
	}, nil
}

func (a *account) ValidateToken(account types.Account) (bool, error) {
	if account.Token == nil {
		return false, types.ErrorTokenIsNil
	}
	if account.TokenExp == nil {
		return false, types.ErrorTokenExpIsNil
	}

	if time.Now().After(*account.TokenExp) {
		return false, types.ErrorTokenHasExpired
	}

	return true, nil
}

func (a *account) HasAccess(account types.Account, role string) (bool, error) {
	var authorized bool
	switch role {
	case types.UserRole:
		authorized = account.Role == types.UserRole || account.Role == types.DeveloperRole || account.Role == types.AdminRole
	case types.DeveloperRole:
		authorized = account.Role == types.DeveloperRole || account.Role == types.AdminRole
	case types.AdminRole:
		authorized = account.Role == types.AdminRole
	default:
		return false, errors.New("invalid role, " + role)
	}

	if !authorized {
		return false, errors.New("account does not have the role, " + role)
	}

	return true, nil
}

func (a *account) GetProfile(token string) (*types.Profile, error) {
	account, err := database.GetAccountByToken(token)
	if err != nil {
		return nil, err
	}

	return &types.Profile{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		VerifiedEmail: account.VerifiedEmail,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}, nil
}

func (a *account) UpdateProfile(account *types.Account, data *types.Profile) (*types.Profile, error) {
	newAccount := types.Account{
		ID: account.ID,
		Email: data.Email,
		Username: data.Username,
		Password: account.Password,
		Token: account.Token,
		TokenExp: account.TokenExp,
		Role: account.Role,
		Avatar: data.Avatar,
		Biography: data.Biography,
		VerifiedEmail: account.VerifiedEmail,
		VerifyEmailCode: account.VerifyEmailCode,
		ForgotPasswordCode: account.ForgotPasswordCode,
		TwoFactorEnabled: account.TwoFactorEnabled,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}

	err := database.UpdateAccount(newAccount)
	if err != nil {
		return nil, err
	}

	return &types.Profile{
		ID: newAccount.ID,
		Email: newAccount.Email,
		Username: newAccount.Username,
		Role: newAccount.Role,
		Avatar: newAccount.Avatar,
		Biography: newAccount.Biography,
		VerifiedEmail: newAccount.VerifiedEmail,
		CreatedAt: newAccount.CreatedAt,
		UpdatedAt: newAccount.UpdatedAt,
	}, nil
}

func (a *account) GetAddresses(account types.Account) ([]types.Address, error) {
	addresses, err := database.GetAllAddressesByAccountID(account.ID)
	if err != nil {
		return nil, err
	}

	return *addresses, nil
}

func (a *account) UpdateAddress(account types.Account, data types.Address) (*types.Address, error) {
	address := types.Address{
		ID: data.ID,
		Street: data.Street,
		City: data.City,
		State: data.State,
		Country: data.Country,
		PostalCode: data.PostalCode,
		AccountID: account.ID,
	}

	err := database.UpdateAddress(&address)
	if err != nil {
		return nil, err
	}

	return &types.Address{
		ID: address.ID,
		Street: address.Street,
		City: address.City,
		State: address.State,
		Country: address.Country,
		PostalCode: address.PostalCode,
		AccountID: address.AccountID,
	}, nil
}

func (a *account) CreateAddress(account types.Account, data types.Address) (*types.Address, error) {
	address := types.Address{
		ID: uuid.New().String(),
		Street: data.Street,
		City: data.City,
		State: data.State,
		Country: data.Country,
		PostalCode: data.PostalCode,
		AccountID: account.ID,
	}

	err := database.CreateAddress(&address)
	if err != nil {
		return nil, err
	}

	return &types.Address{
		ID: address.ID,
		Street: address.Street,
		City: address.City,
		State: address.State,
		Country: address.Country,
		PostalCode: address.PostalCode,
		AccountID: address.AccountID,
	}, nil
}

func (a *account) UpdatePassword(account types.Account, data types.UpdatePasswordData) (error) {
	if len(data.Password) < 1 {
		return types.ErrorPasswordLength
	} else if len(data.NewPassword) < 1 {
		return types.ErrorPasswordLength
	}

	hashedPassword := utils.StringToSha512(data.Password)
	if hashedPassword != account.Password {
		return types.ErrorPasswordsDoNotMatch
	}

	newHashedPassword := utils.StringToSha512(data.NewPassword)

	newAccount := types.Account{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Password: newHashedPassword,
		Token: account.Token,
		TokenExp: account.TokenExp,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		VerifiedEmail: account.VerifiedEmail,
		VerifyEmailCode: account.VerifyEmailCode,
		ForgotPasswordCode: account.ForgotPasswordCode,
		TwoFactorEnabled: account.TwoFactorEnabled,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}

	err := database.UpdateAccount(newAccount)
	if err != nil {
		return err
	}

	return nil
}

func (a *account) VerifyEmail(code string) (error) {
	account, err := database.GetAccountByVerifyEmailCode(code)
	if err != nil {
		return err
	}

	newAccount := types.Account{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Password: account.Password,
		Token: account.Token,
		TokenExp: account.TokenExp,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		VerifiedEmail: true,
		VerifyEmailCode: account.VerifyEmailCode,
		ForgotPasswordCode: account.ForgotPasswordCode,
		TwoFactorEnabled: account.TwoFactorEnabled,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}

	err = database.UpdateAccount(newAccount)
	if err != nil {
		return err
	}

	return nil
}

func (a *account) ToggleTwoFactor(account types.Account, enabled bool) (error) {
	newAccount := types.Account{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Password: account.Password,
		Token: account.Token,
		TokenExp: account.TokenExp,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		VerifiedEmail: account.VerifiedEmail,
		VerifyEmailCode: account.VerifyEmailCode,
		ForgotPasswordCode: account.ForgotPasswordCode,
		TwoFactorEnabled: enabled,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}

	err := database.UpdateAccount(newAccount)
	if err != nil {
		return err
	}

	return nil
}

func (a *account) ForgotPassword(_email string) (bool, error) {
	emailExists, err := database.GetAccountByEmail(_email)
	if err != nil {
		return false, err
	}

	if emailExists != nil {
		resetCode, err := a.GenerateToken()
		if err != nil {
			return false, err
		}

		err = email.SendForgotPasswordCode(_email, resetCode.Token)
		if err != nil {
			return false, err
		}

		newAccount := types.Account{
			ID: emailExists.ID,
			Email: emailExists.Email,
			Username: emailExists.Username,
			Password: emailExists.Password,
			Token: emailExists.Token,
			TokenExp: emailExists.TokenExp,
			Role: emailExists.Role,
			Avatar: emailExists.Avatar,
			Biography: emailExists.Biography,
			VerifiedEmail: emailExists.VerifiedEmail,
			VerifyEmailCode: emailExists.VerifyEmailCode,
			ForgotPasswordCode: &resetCode.Token,
			TwoFactorEnabled: emailExists.TwoFactorEnabled,
			CreatedAt: emailExists.CreatedAt,
			UpdatedAt: emailExists.UpdatedAt,
		}

		err = database.UpdateAccount(newAccount)
		if err != nil {
			return false, err
		}
	}

	return true, nil
}

func (a *account) ResetPassword(code string, password string) (error) {
	account, err := database.GetAccountByForgotPasswordCode(code)
	if err != nil {
		return err
	}

	newHashedPassword := utils.StringToSha512(password)

	newAccount := types.Account{
		ID: account.ID,
		Email: account.Email,
		Username: account.Username,
		Password: newHashedPassword,
		Token: account.Token,
		TokenExp: account.TokenExp,
		Role: account.Role,
		Avatar: account.Avatar,
		Biography: account.Biography,
		VerifiedEmail: account.VerifiedEmail,
		VerifyEmailCode: account.VerifyEmailCode,
		ForgotPasswordCode: nil,
		TwoFactorEnabled: account.TwoFactorEnabled,
		CreatedAt: account.CreatedAt,
		UpdatedAt: account.UpdatedAt,
	}

	err = database.UpdateAccount(newAccount)
	if err != nil {
		return err
	}

	return nil
}