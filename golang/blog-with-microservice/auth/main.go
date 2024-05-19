package main

import (
	"log"
	"net"

	"google.golang.org/grpc"

	pb "struckchure.recipe.auth/pb"
)

func main() {
	lis, err := net.Listen("tcp", ":50050")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()

	authServer := NewAuthServer()
	pb.RegisterAuthServer(s, authServer)

	log.Printf("server listening at %v", lis.Addr())

	err = s.Serve(lis)
	if err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
