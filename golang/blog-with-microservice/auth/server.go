package main

import (
	"context"

	pb "struckchure.recipe.auth/pb"
)

type AuthServer struct {
	pb.UnimplementedAuthServer
}

func (s *AuthServer) Login(ctx context.Context, in *pb.LoginRequest) (*pb.LoginResponse, error) {
	return &pb.LoginResponse{}, nil
}

func (s *AuthServer) Register(ctx context.Context, in *pb.RegisterRequest) (*pb.RegisterResponse, error) {
	return &pb.RegisterResponse{}, nil
}

func NewAuthServer() *AuthServer {
	return &AuthServer{}
}
