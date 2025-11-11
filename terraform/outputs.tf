output "resume_bucket_name" {
  description = "Name of the S3 bucket storing resume uploads"
  value       = aws_s3_bucket.resumes.bucket
}

output "resume_bucket_arn" {
  description = "ARN of the resumes bucket"
  value       = aws_s3_bucket.resumes.arn
}

output "db_endpoint" {
  description = "Endpoint for the Aurora PostgreSQL cluster"
  value       = aws_rds_cluster.postgres.endpoint
}

output "upload_signer_role_arn" {
  description = "IAM role ARN that can sign S3 uploads"
  value       = aws_iam_role.upload_signer.arn
}

