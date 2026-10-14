variable "aws_region" {
  type        = string
  description = "AWS region for infrastructure provisioning."
  default     = "ap-south-1"
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type for web server."
  default     = "t3.micro"
}

variable "bucket_name" {
  type        = string
  description = "Globally unique name for the S3 bucket."
  default     = "sahadheep-session19-cloud-assets-bucket"
}
