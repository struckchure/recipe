package clients

import (
	"context"
	"log"
	"os"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	post_pb "struckchure.recipe.gateway/pb/posts"
)

type PostClient struct {
	ctx    context.Context
	client post_pb.PostClient
}

func (c *PostClient) List(args *post_pb.ListRequest) (*post_pb.ListResponse, error) {
	return c.client.List(c.ctx, args)
}

func (c *PostClient) Create(args *post_pb.CreateRequest) (*post_pb.CreateResponse, error) {
	return c.client.Create(c.ctx, args)
}

func (c *PostClient) Get(args *post_pb.GetRequest) (*post_pb.GetResponse, error) {
	return c.client.Get(c.ctx, args)
}

func (c *PostClient) Update(args *post_pb.UpdateRequest) (*post_pb.UpdateResponse, error) {
	return c.client.Update(c.ctx, args)
}

func (c *PostClient) Delete(args *post_pb.DeleteRequest) (*post_pb.DeleteResponse, error) {
	return c.client.Delete(c.ctx, args)
}

func NewPostClient() *PostClient {
	conn, err := grpc.NewClient(os.Getenv("POST_SERVICE_URL"), grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	c := post_pb.NewPostClient(conn)

	return &PostClient{ctx: context.Background(), client: c}
}
