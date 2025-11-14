terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "resumes" {
  bucket        = var.resume_bucket_name
  force_destroy = false

  versioning {
    enabled = true
  }

  lifecycle_rule {
    id      = "expire-noncurrent"
    enabled = true

    noncurrent_version_expiration {
      days = 90
    }
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_s3_bucket_public_access_block" "resumes" {
  bucket                  = aws_s3_bucket.resumes.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "resumes" {
  bucket = aws_s3_bucket.resumes.id

  cors_rule {
    allowed_methods = ["PUT"]
    allowed_origins = var.allowed_upload_origins
    allowed_headers = ["*"]
    max_age_seconds = 300
  }
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${var.project_name}/db"
  description = "PostgreSQL credentials for SOYL careers application"
}

resource "aws_secretsmanager_secret" "sendgrid" {
  name        = "${var.project_name}/sendgrid"
  description = "SendGrid API key for careers notifications"
}

resource "aws_security_group" "db" {
  name        = "${var.project_name}-db-sg"
  description = "Allow database access from app security group"
  vpc_id      = var.vpc_id

  ingress {
    description      = "App access"
    from_port        = 5432
    to_port          = 5432
    protocol         = "tcp"
    security_groups  = [var.app_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_rds_cluster" "postgres" {
  cluster_identifier      = "${var.project_name}-pg"
  engine                  = "aurora-postgresql"
  engine_mode             = "provisioned"
  engine_version          = "15.3"
  database_name           = var.db_name
  master_username         = var.db_username
  master_password         = var.db_password
  skip_final_snapshot     = true
  backup_retention_period = 3
  vpc_security_group_ids  = [aws_security_group.db.id]
}

data "aws_iam_policy_document" "lambda_trust" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "upload_signer" {
  name               = "${var.project_name}-upload-signer"
  assume_role_policy = data.aws_iam_policy_document.lambda_trust.json
}

data "aws_iam_policy_document" "upload_policy" {
  statement {
    actions = ["s3:PutObject", "s3:GetObject"]
    resources = [
      "${aws_s3_bucket.resumes.arn}/resumes/*"
    ]
  }
}

resource "aws_iam_policy" "upload" {
  name   = "${var.project_name}-upload-policy"
  policy = data.aws_iam_policy_document.upload_policy.json
}

resource "aws_iam_role_policy_attachment" "upload_attachment" {
  role       = aws_iam_role.upload_signer.name
  policy_arn = aws_iam_policy.upload.arn
}


