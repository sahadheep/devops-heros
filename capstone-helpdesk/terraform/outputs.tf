output "cluster_name" {
  description = "Name of the created EKS cluster"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Public API server endpoint for kubectl communication"
  value       = module.eks.cluster_endpoint
}

output "vpc_id" {
  description = "VPC ID where EKS is provisioned"
  value       = module.vpc.vpc_id
}

output "configure_kubectl" {
  description = "AWS CLI command to update local kubeconfig"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${module.eks.cluster_name}"
}
