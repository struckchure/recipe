# Makefile to build and push Docker images for three services

# Image names and directories
AUTH_DIR=./auth
POSTS_DIR=./posts
GATEWAY_DIR=./gateway

AUTH_IMAGE=ghcr.io/struckchure/recipe/blog-with-micro-auth
POSTS_IMAGE=ghcr.io/struckchure/recipe/blog-with-micro-posts
GATEWAY_IMAGE=ghcr.io/struckchure/recipe/blog-with-micro-gateway

.PHONY: all build push auth auth-build auth-push posts posts-build posts-push gateway gateway-build gateway-push clean

# Default target to build and push all images
all: build push

# Build all images
build: auth-build posts-build gateway-build

# Push all images
push: auth-push posts-push gateway-push

# Build auth image
auth: auth-build auth-push

auth-build:
	@echo "Building $(AUTH_IMAGE) from $(AUTH_DIR)..."
	docker build -t $(AUTH_IMAGE) $(AUTH_DIR)

auth-push:
	@echo "Pushing $(AUTH_IMAGE)..."
	docker push $(AUTH_IMAGE)

# Build posts image
posts: posts-build posts-push

posts-build:
	@echo "Building $(POSTS_IMAGE) from $(POSTS_DIR)..."
	docker build -t $(POSTS_IMAGE) $(POSTS_DIR)

posts-push:
	@echo "Pushing $(POSTS_IMAGE)..."
	docker push $(POSTS_IMAGE)

# Build gateway image
gateway: gateway-build gateway-push

gateway-build:
	@echo "Building $(GATEWAY_IMAGE) from $(GATEWAY_DIR)..."
	docker build -t $(GATEWAY_IMAGE) $(GATEWAY_DIR)

gateway-push:
	@echo "Pushing $(GATEWAY_IMAGE)..."
	docker push $(GATEWAY_IMAGE)

# Clean up Docker images
clean:
	@echo "Cleaning up Docker images..."
	docker rmi $(AUTH_IMAGE) $(POSTS_IMAGE) $(GATEWAY_IMAGE)
