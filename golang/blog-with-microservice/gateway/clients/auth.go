package clients

import (
	"context"
	"log"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	auth_pb "struckchure.recipe.gateway/pb/auth"
)

type AuthClient struct {
	ctx    context.Context
	client auth_pb.AuthClient
}

func (c *AuthClient) Login(args *auth_pb.LoginRequest) (*auth_pb.LoginResponse, error) {
	return c.client.Login(c.ctx, args)
}

func (c *AuthClient) Register(args *auth_pb.RegisterRequest) (*auth_pb.RegisterResponse, error) {
	return c.client.Register(c.ctx, args)
}

func NewAuthClient() *AuthClient {
	conn, err := grpc.NewClient(os.Getenv("AUTH_SERVICE_URL"), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	c := auth_pb.NewAuthClient(conn)

	return &AuthClient{ctx: context.Background(), client: c}
}
