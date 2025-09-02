**WinSCP Upload Guide**
- Goal: Transfer `docker-compose.aws.yml`, `.env`, and `Caddyfile` to the EC2 host.

**What You Need**
- EC2 Public DNS or IP from CloudFormation outputs.
- Your EC2 key pair private key file (`.pem`).
- WinSCP installed on Windows.

**Convert Key (if needed)**
- WinSCP can use PuTTY `.ppk` keys.
- If you only have `.pem`, use PuTTYgen:
  - Open PuTTYgen → Load → select `.pem` (set file filter to All files).
  - Save private key → produces `.ppk` file.

**Create Session**
- Host name: `<EC2PublicDNS>` (from stack outputs)
- Port: `22`
- File protocol: `SFTP`
- User name: `ec2-user` (Amazon Linux default)
- Advanced → SSH → Authentication → Private key file → browse to your `.ppk` (or `.pem` if supported)
- Save session, then Login. Accept the host key prompt.

**Upload Files**
- On the right (remote), navigate to `/home/ec2-user/app`.
- On the left (local), open your repo folder `deploy/backend-ec2/`.
- Upload:
  - `docker-compose.aws.yml`
  - `Caddyfile`
  - Copy `.env.aws.example` to `.env`, edit locally, then upload `.env` (do NOT commit real secrets).

**Run on EC2**
- Option 1 (WinSCP): Commands → Open in PuTTY → run:
  - `cd ~/app`
  - `docker compose -f docker-compose.aws.yml --env-file .env up -d`
- Option 2 (AWS Console): Use Session Manager to open a shell and run the same commands.

**Troubleshooting**
- Connection refused: Ensure security group allows SSH from your IP (`AllowedCidr`).
- Permission denied: Verify username is `ec2-user` and key is correct.
- Compose not found: Reboot once (`sudo reboot`) after first boot or run `docker --version && docker compose version` to confirm install.

