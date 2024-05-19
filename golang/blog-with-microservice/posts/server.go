package main

import (
	"context"
	"errors"

	"github.com/google/uuid"
	pb "struckchure.recipe.posts/pb"
)

type Post struct {
	Id      string
	Title   string
	Content string
	Author  string
}

var posts []Post = []Post{}

type PostServer struct {
	pb.UnimplementedPostServer
}

func (s *PostServer) List(ctx context.Context, payload *pb.ListRequest) (*pb.ListResponse, error) {
	data := make([]*pb.ListResponse_Data, len(posts))
	for i, post := range posts {
		data[i] = &pb.ListResponse_Data{
			Id:      post.Id,
			Title:   post.Title,
			Content: post.Content,
			Author:  post.Author,
		}
	}

	return &pb.ListResponse{Data: data}, nil
}

func (s *PostServer) Create(ctx context.Context, payload *pb.CreateRequest) (*pb.CreateResponse, error) {
	post := Post{
		Id:      uuid.NewString(),
		Title:   payload.Title,
		Content: payload.Content,
		Author:  payload.Author,
	}

	posts = append(posts, post)

	return &pb.CreateResponse{
		Id:      post.Id,
		Title:   post.Title,
		Content: post.Content,
		Author:  post.Author,
	}, nil
}

func (s *PostServer) Get(ctx context.Context, payload *pb.GetRequest) (*pb.GetResponse, error) {
	var post *Post = nil

	for _, _post := range posts {
		if _post.Id == payload.Id {
			post = &_post
			break
		}
	}

	if post == nil {
		return nil, errors.New("post not found")
	}

	return &pb.GetResponse{
		Id:      post.Id,
		Title:   post.Title,
		Content: post.Content,
		Author:  post.Author,
	}, nil
}

func (s *PostServer) Update(ctx context.Context, payload *pb.UpdateRequest) (*pb.UpdateResponse, error) {
	var post *Post = nil

	for index, _post := range posts {
		if _post.Id == payload.Id {
			post = &_post

			if payload.Title != nil {
				post.Title = *payload.Title
			}

			if payload.Content != nil {
				post.Content = *payload.Content
			}

			if payload.Author != nil {
				post.Author = *payload.Author
			}
			posts[index] = *post

			break
		}
	}

	if post == nil {
		return nil, errors.New("post not found")
	}

	return &pb.UpdateResponse{
		Id:      post.Id,
		Title:   post.Title,
		Content: post.Content,
		Author:  post.Author,
	}, nil
}

func (s *PostServer) Delete(ctx context.Context, payload *pb.DeleteRequest) (*pb.DeleteResponse, error) {
	var post *Post = nil

	for index, _post := range posts {
		if _post.Id == payload.Id {
			post = &_post

			posts = append(posts[:index], posts[index+1:]...)

			break
		}
	}

	if post == nil {
		return nil, errors.New("post not found")
	}

	return &pb.DeleteResponse{}, nil
}

func NewPostServer() *PostServer {
	return &PostServer{}
}
