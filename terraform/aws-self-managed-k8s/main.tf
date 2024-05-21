terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

resource "aws_vpc" "recipe_k8s_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "recipe-k8s-vpc"
  }
}

resource "aws_internet_gateway" "recipe_k8s_igw" {
  vpc_id = aws_vpc.recipe_k8s_vpc.id
  tags = {
    Name = "recipe-k8s-igw"
  }
}

resource "aws_subnet" "public_subnet" {
  for_each = {
    "us-east-1a" = "10.0.1.0/24"
    "us-east-1b" = "10.0.2.0/24"
  }
  vpc_id                  = aws_vpc.recipe_k8s_vpc.id
  cidr_block              = each.value
  availability_zone       = each.key
  map_public_ip_on_launch = true
  tags = {
    Name = "recipe-k8s-subnet-public-${each.key}"
  }
}

resource "aws_route_table" "public_rtb" {
  vpc_id = aws_vpc.recipe_k8s_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.recipe_k8s_igw.id
  }
  tags = {
    Name = "recipe-k8s-rtb-public"
  }
}

resource "aws_route_table_association" "public_rtb_association" {
  for_each       = aws_subnet.public_subnet
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public_rtb.id
}

resource "aws_security_group" "recipe_k8s_sg" {
  name        = "recipe-k8s-sg"
  description = "Security group for allowing all port ranges and protocols"
  vpc_id      = aws_vpc.recipe_k8s_vpc.id

  ingress {
    description = "Allow all inbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # All protocols
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "recipe-k8s-sg"
  }
}

resource "aws_key_pair" "recipe_k8s_keypair" {
  key_name   = "recipe-k8s-keypair"
  public_key = file("id_rsa.pub")
}

resource "random_integer" "subnet_index" {
  min = 0
  max = length(keys(aws_subnet.public_subnet)) - 1
}

resource "aws_instance" "recipe_k8s_control_plane" {
  ami           = "ami-04b70fa74e45c3917"                                                 # Replace with your desired AMI ID
  instance_type = "t3.medium"                                                             # Replace with your desired instance type
  key_name      = aws_key_pair.recipe_k8s_keypair.key_name                                # Use the created key pair name
  subnet_id     = values(aws_subnet.public_subnet)[random_integer.subnet_index.result].id # Select a random subnet ID

  vpc_security_group_ids      = [aws_security_group.recipe_k8s_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 30
  }

  user_data = <<-EOF
              #!/bin/bash
              hostnamectl set-hostname recipe-k8s-control-plane
              echo "127.0.0.1 $(hostname)" >> /etc/hosts
              EOF

  tags = {
    Name = "recipe-k8s-control-plane"
  }
}

variable "instance_count" {
  description = "Number of worker nodes to create."
  type        = number
  default     = 2
}

resource "aws_instance" "recipe_k8s_worker_nodes" {
  count         = var.instance_count
  ami           = "ami-04b70fa74e45c3917"                                                 # Replace with your desired AMI ID
  instance_type = "t3.medium"                                                             # Replace with your desired instance type
  key_name      = aws_key_pair.recipe_k8s_keypair.key_name                                # Use the created key pair name
  subnet_id     = values(aws_subnet.public_subnet)[random_integer.subnet_index.result].id # Select a random subnet ID

  vpc_security_group_ids      = [aws_security_group.recipe_k8s_sg.id]
  associate_public_ip_address = true

  root_block_device {
    volume_size = 30
  }

  user_data = <<-EOF
              #!/bin/bash
              hostnamectl set-hostname recipe-k8s-worker-node-${count.index + 1}
              echo "127.0.0.1 $(hostname)" >> /etc/hosts
              EOF

  tags = {
    Name = "recipe-k8s-worker-node-${count.index + 1}"
  }
}

output "recipe_k8s_control_plane" {
  value = aws_instance.recipe_k8s_control_plane.public_ip
}

output "recipe_k8s_worker_nodes" {
  value = [for instance in aws_instance.recipe_k8s_worker_nodes : instance.public_ip]
}
