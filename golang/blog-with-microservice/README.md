# Blog With Microservice

This project consists of 2 microservices and 1 api gateway, all written in golan.

# Setup Tools

- Generate proto stubs

```sh
$ go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
$ go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

- For Auth Service

```sh
$ cd auth
$ protoc --go_out=pb --go_opt=paths=source_relative --go-grpc_out=pb --go-grpc_opt=paths=source_relative auth.proto
```

- For Posts Service

```sh
$ cd posts
$ protoc --go_out=pb --go_opt=paths=source_relative --go-grpc_out=pb --go-grpc_opt=paths=source_relative posts.proto
```
