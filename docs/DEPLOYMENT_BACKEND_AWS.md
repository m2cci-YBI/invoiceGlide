**Overview**
- Deploys a free‑tier friendly backend on AWS using CloudFormation.
- Stack creates a new VPC, one public EC2 (for Docker + Caddy), and a private RDS PostgreSQL.
- You will upload a production `docker-compose` + `.env` + `Caddyfile` to EC2 and run the services.

**Prerequisites**
- AWS account with CLI configured (`aws configure`).
- Existing EC2 Key Pair name in the target region (for SSH/WinSCP).
- ECR Public images pushed with tags `admin-latest`, `invoice-latest`, `mailing-latest`, `gateway-latest`.
- Your public IP/CIDR to restrict SSH/HTTP access (e.g., `x.y.z.w/32`).

**1) Launch CloudFormation Stack (us-east-2)**
- Template: `infra/cloudformation/backend-stack.yaml`
- Creates: VPC, subnets, security groups, RDS (Postgres), EC2 (Amazon Linux 2023), and SSM access.

- Console steps:
  - Go to CloudFormation → Create stack → With new resources (standard).
  - Upload `backend-stack.yaml`.
  - Parameters:
    - `StackNameSuffix`: short label like `invoice`.
    - `KeyName`: your existing EC2 key pair.
    - `AllowedCidr`: your IP CIDR (e.g., `x.y.z.w/32`).
    - `DBPassword`: choose a strong password (min 8 chars).
    - Leave instance classes at defaults for free tier.
  - Acknowledge IAM and create the stack.

- CLI example (region us-east-2):
  - `aws cloudformation deploy --region us-east-2 --template-file infra/cloudformation/backend-stack.yaml --stack-name invoice-backend --capabilities CAPABILITY_IAM --parameter-overrides KeyName=YOUR_KEY AllowedCidr=YOUR_CIDR DBPassword=YOUR_DB_PASSWORD`

**2) Capture Outputs**
- From the stack Outputs, note:
  - `EC2PublicDNS` and/or `EC2PublicIP`.
  - `RDSEndpoint` and `RDSPort`.
  - `DBNameOut` (default `invoicedb`).

**3) Prepare Deployment Bundle**
- Use files under `deploy/backend-ec2/`:
  - `docker-compose.aws.yml` — production compose referencing your ECR public repo.
  - `Caddyfile` — reverse-proxy to the `gateway` service on port 80.
  - `.env.aws.example` — copy to `.env` and fill values:
    - `ECR_REPO_URI=public.ecr.aws/<your-alias>/invoices`
    - `DB_URL=jdbc:postgresql://<RDSEndpoint>:5432/invoicedb`
    - `DB_USER` = the `DBUsername` you used (default `invoice`).
    - `DB_PASS` = the `DBPassword` you used.
    - `APP_BASE_URL=http://<EC2PublicDNS>`.
    - `CORS_ALLOWED_ORIGINS=http://localhost:4200` (for local frontend testing).
    - Fill mail config as needed.

**4) Upload Files to EC2**
- See `docs/WINSCP_SETUP.md` for WinSCP steps. You’ll upload to `ec2-user@<EC2PublicDNS>` into `~/app`.

**5) Start the Backend**
- SSH to EC2 or use SSM Session Manager (instance has `AmazonSSMManagedInstanceCore`).
- Commands (on EC2):
  - `cd ~/app`
  - `docker --version && docker compose version`
  - `docker compose -f docker-compose.aws.yml --env-file .env up -d`
  - `docker ps` (check 5 containers: caddy, gateway, admin, invoice, mailing)

**6) Verify**
- From your machine: open `http://<EC2PublicDNS>/` (Caddy proxies to `gateway`).
- Backend should accept requests from your local frontend origin (`http://localhost:4200`).

**Notes & Tips**
- Security: `AllowedCidr=0.0.0.0/0` is open; prefer your `/32` IP while testing.
- RDS is private (no public access); only the EC2 SG can reach port 5432.
- Deleting the stack retains a DB snapshot (DeletionPolicy Snapshot). You’ll need to remove snapshots manually if you want to avoid charges.
- Public ECR images don’t require login to pull.
