package main

import (
	"context"
	"errors"

	"github.com/google/uuid"
	pb "struckchure.recipe.auth/pb"
)

type User struct {
	Id       string
	Username string
	Password string
}

var users []User = []User{}

type AuthServer struct {
	pb.UnimplementedAuthServer

	encryption Encryption
}

func (s *AuthServer) Login(ctx context.Context, payload *pb.LoginRequest) (*pb.LoginResponse, error) {
	var user *User

	for _, _user := range users {
		if _user.Username == payload.Username && _user.Password == payload.Password {
			user = &_user
			break
		}
	}

	if user == nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := s.encryption.Encrypt(user.Id)
	if err != nil {
		return nil, err
	}

	return &pb.LoginResponse{Token: token}, nil
}

func (s *AuthServer) Register(ctx context.Context, payload *pb.RegisterRequest) (*pb.RegisterResponse, error) {
	user := User{
		Id:       uuid.NewString(),
		Username: payload.Username,
		Password: payload.Password,
	}
	users = append(users, user)

	return &pb.RegisterResponse{Message: "registration successful"}, nil
}

func NewAuthServer() *AuthServer {
	return &AuthServer{encryption: *NewEncryption("simple-key")}
}
