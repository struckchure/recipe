package main

import (
	"log"
	"net"

	"google.golang.org/grpc"

	pb "struckchure.recipe.posts/pb"
)

func main() {
	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()

	postServer := NewPostServer()
	pb.RegisterPostServer(s, postServer)

	log.Printf("server listening at %v", lis.Addr())

	err = s.Serve(lis)
	if err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
