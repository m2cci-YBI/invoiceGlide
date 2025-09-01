Minimal AWS deployment stacks for this app.

Order of deployment (dev):

1) network.yaml
   - Creates VPC, subnets (public/app/db), IGW, NAT, route tables
   - Security groups for ECS and RDS
   - Cloud Map private DNS namespace
   - Internal NLB + Target Groups for ports 8081/8082/8083
   - Exports: VPC/Subnets/SG IDs, Namespace, NLB listener ARNs, TG ARNs

2) data.yaml
   - RDS PostgreSQL (single-AZ), subnet group, Secrets Manager secret
   - Imports SG/Subnets from network

3) ecr.yaml
   - ECR repositories for admin, invoice, mailing

4) ecs.yaml
   - ECS Cluster, IAM roles
   - Task Definitions for admin/invoice/mailing with env/secrets from SSM/Secrets
   - Services with service discovery (Cloud Map) and NLB Target Group attachments
   - Imports: VPC/Subnets/SGs, Cloud Map namespace, TG ARNs

5) apigw.yaml
   - HTTP API + VPC Link to NLB
   - Routes:
     - /api/v1/{proxy+} -> admin (8081)
     - /api/invoice/v1/{proxy+} -> invoice (8082)
     - /api/mail/v1/{proxy+} -> mailing (8083)
   - Optional custom domain can be added later

6) frontend.yaml
   - S3 bucket for SPA + OAC
   - CloudFront distribution: default S3 origin, /api/* to API Gateway origin
   - SPA fallback (403/404 -> /index.html)

Parameters
----------
See params/dev.json for a starting set. Adjust CIDRs, domain names, and instance sizes as needed.

Build and push images
---------------------
- Build/push Docker images to the created ECR repos (admin, invoice, mailing).
- Update ecs.yaml parameters (image tags) and deploy.

Notes
-----
- Internal service URLs use Cloud Map and bypass API Gateway.
- API Gateway is only for external client API access.
- For prod hardening: add WAF (API GW/CloudFront), Multi-AZ RDS, alarms.

