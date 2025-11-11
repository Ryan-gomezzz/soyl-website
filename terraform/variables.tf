variable "project_name" {
  description = "Project prefix (e.g. soyl-careers)"
  type        = string
}

variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "resume_bucket_name" {
  description = "Name of the private S3 bucket that stores resumes"
  type        = string
}

variable "allowed_upload_origins" {
  description = "Allowed origins for browser-based PUT uploads"
  type        = list(string)
  default     = ["https://soyl.ai", "http://localhost:3000"]
}

variable "db_name" {
  description = "Database name for the applicants schema"
  type        = string
  default     = "soyl_applicants"
}

variable "db_username" {
  description = "Admin username for RDS cluster"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Admin password for RDS cluster"
  type        = string
  sensitive   = true
}

variable "vpc_id" {
  description = "VPC ID where RDS cluster will be deployed"
  type        = string
}

variable "app_security_group_id" {
  description = "Security group ID of the application (ECS/EC2/Lambda) allowed to reach the database"
  type        = string
}

