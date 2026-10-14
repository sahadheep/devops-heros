variable "aws_region" {
  type        = string
  description = "AWS region where resources will be provisioned."
  default     = "ap-south-1"
}

variable "bucket_name" {
  type        = string
  description = "Globally unique name for the AWS S3 bucket."
  default     = "sahadheep-terraform-s3-demo-bucket"
}
