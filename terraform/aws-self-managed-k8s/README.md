# AWS Self-Managed Kubernetes Automation

This project provides an automated solution for setting up and managing a self-managed [Kubernetes](https://kubernetes.io) cluster on AWS using [Terraform](https://www.terraform.io) and [Ansible](https://ansible.com). The automation scripts ensure a streamlined deployment process, allowing you to focus on your applications rather than the underlying infrastructure.

### Key Features

- **Infrastructure as Code**: Utilize Terraform to provision AWS resources required for the Kubernetes cluster.
- **Configuration Management**: Use Ansible to configure and manage the Kubernetes cluster nodes.
- **Secure Credential Handling**: Implement best practices for securely managing AWS credentials.
- **Cert Management**: Automate the creation and renewal of necessary certificates for secure communication within the cluster.
- **Scalability**: Easily scale your Kubernetes cluster by adjusting configurations in the Terraform scripts.

### Prerequisites

- AWS Account
- Terraform installed
- AWS CLI configured with appropriate access

# Usage

To create services and other black magic 😅

```sh
$ terraform apply -var-file="terraform.tfvars"
```

To destroy all services and black magic ...

```sh
$ terraform destroy -var-file="terraform.tfvars"
```

To get ec2 hosts for ansible

```sh
$ cd terraform/aws-self-managed-k8s
$ python3 generate-inventory.py > ../../ansible/aws-self-managed-k8s/inventory.ini
```
