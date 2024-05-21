# AWS Self-Managed Kubernetes Automation

This section of the project contains [Ansible](https://ansible.com) playbooks designed to automate the setup and configuration of a self-managed [Kubernetes](https://kubernetes.io) cluster on AWS using [Microk8s](https://microk8s.io). The playbooks handle the provisioning of both the control plane and worker nodes, ensuring a consistent and repeatable deployment process.

### Key Features

- **Cluster Setup**: Playbooks to initialize and configure the Kubernetes control plane and worker nodes.
- **Node Management**: Automate the addition and removal of nodes in the cluster.
- **Configuration Management**: Ensure all nodes are configured with the necessary settings and security measures.
- **Cert Management**: Automate the creation and renewal of certificates for secure communication within the cluster.

### Prerequisites

- Ansible installed
- Inventory file defining the control plane and worker nodes
- AWS resources provisioned using Terraform

# Usage

Generate inventory file

```sh
$ cd terraform/aws-self-managed-k8s
$ python3 generate-inventory.py > ../../ansible/aws-self-managed-k8s/inventory.ini
```

> NOTE: You should have applied all your terraform changes for this to work

Apply all ansible playbooks

```sh
$ cd recipe/ansible/aws-self-managed-k8s
$ ansible-playbook -i inventory.ini --private-key=id_rsa \
  playbooks/install-microk8s.yaml \
  playbooks/setup-worker-nodes.yaml \
  playbooks/setup-control-plane.yaml \
  playbooks/download-kubeconfig.yaml
```
