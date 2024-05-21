import json
import subprocess

# Run Terraform output command to get the public IPs of instances
terraform_output = subprocess.run(
    ["terraform", "output", "-json"], capture_output=True, text=True
)
output_json = json.loads(terraform_output.stdout)

# Extract control plane and worker nodes public IPs
control_plane_ip = output_json["recipe_k8s_control_plane"]["value"]
worker_nodes_ips = output_json["recipe_k8s_worker_nodes"]["value"]

# Generate inventory format
inventory = {
    "control_plane": {
        "control-plane-1": {"ansible_host": control_plane_ip, "ansible_user": "ubuntu"}
    },
    "worker_nodes": {},
}

for i, ip in enumerate(worker_nodes_ips, start=1):
    inventory["worker_nodes"][f"worker-node-{i}"] = {
        "ansible_host": ip,
        "ansible_user": "ubuntu",
    }

# Print the inventory in the desired format
for group, hosts in inventory.items():
    print(f"[{group}]")
    for host, attrs in hosts.items():
        attr_str = " ".join([f"{key}={value}" for key, value in attrs.items()])
        print(f"{host} {attr_str}")
    print("")
