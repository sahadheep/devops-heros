variable "aws_region" {
  description = "AWS region for the HelpDesk Pro infrastructure"
  type        = string
  default     = "ap-south-1"
}

variable "cluster_name" {
  description = "Name of the AWS EKS Kubernetes cluster"
  type        = string
  default     = "helpdesk-eks"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.30.0.0/16"
}
