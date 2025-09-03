Param(
  [string]$Alias = "y0v6t3a3",                    # your ECR Public alias
  [string]$Repo  = "invoices",                    # single repo to hold all images
  [string]$RegionPublic = "us-east-1",            # ECR Public auth region (fixed)
  [string]$AdminLocal   = "backend-admin-service",    # local image names (default :latest)
  [string]$InvoiceLocal = "backend-invoice-service",
  [string]$MailingLocal = "backend-mailing-service",
  [string]$CaddyLocal   = "backend-caddy",
  [string]$AdminTag     = "admin-latest",         # tags to use in the single repo
  [string]$InvoiceTag   = "invoice-latest",
  [string]$MailingTag   = "mailing-latest",
  [string]$CaddyTag     = "caddy-latest"
)

$ErrorActionPreference = "Stop"

function Ensure-EcrPublicRepo {
  param([string]$Name)
  try {
    aws ecr-public describe-repositories --region $RegionPublic --repository-names $Name | Out-Null
  } catch {
    Write-Host "Creating ECR Public repository '$Name'..." -ForegroundColor Yellow
    aws ecr-public create-repository --region $RegionPublic --repository-name $Name | Out-Null
  }
}

function New-TempDockerConfig {
  # Returns path to a temporary Docker config with only ECR Public auth in it
  $token = (aws ecr-public get-login-password --region $RegionPublic).Trim()
  if (-not $token) { throw "Failed to obtain ECR Public login token." }
  $authB64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("AWS:$token"))

  $cfg = Join-Path $env:TEMP ("docker-auth-public-" + (Get-Date -Format "yyyyMMddHHmmss"))
  New-Item -ItemType Directory -Force -Path $cfg | Out-Null
  $json = '{"auths":{"public.ecr.aws":{"auth":"' + $authB64 + '"}}}'
  $json | Out-File -Encoding ascii -FilePath (Join-Path $cfg "config.json")
  return $cfg
}

function Resolve-LocalImage {
  param([string]$ImageName)
  # try exact
  try {
    docker image inspect $ImageName | Out-Null
    return $ImageName
  } catch {
    # try with :latest
    $candidate = "$ImageName`:latest"
    docker image inspect $candidate | Out-Null
    return $candidate
  }
}

function Tag-And-Push {
  param(
    [string]$LocalImage,   # e.g., backend-admin-service   (defaults to :latest)
    [string]$DestUri,      # e.g., public.ecr.aws/alias/invoices:admin-latest
    [string]$DockerConfig  # path to temp docker config
  )
  $resolved = Resolve-LocalImage -ImageName $LocalImage
  Write-Host "Tagging $resolved -> $DestUri" -ForegroundColor Cyan
  docker tag $resolved $DestUri
  Write-Host "Pushing $DestUri" -ForegroundColor Green
  docker --config $DockerConfig push $DestUri
}

# --- Main ---
$repoUri = "public.ecr.aws/$Alias/$Repo"
Write-Host "Using repository: $repoUri" -ForegroundColor Magenta

# Ensure repo exists
Ensure-EcrPublicRepo -Name $Repo

# Create temp docker config with ECR Public auth
$cfg = New-TempDockerConfig
Write-Host "Temporary Docker config: $cfg" -ForegroundColor DarkGray

# Tag & push all four images into SAME repo, different tags
Tag-And-Push -LocalImage $AdminLocal   -DestUri "$($repoUri):$AdminTag"   -DockerConfig $cfg
Tag-And-Push -LocalImage $InvoiceLocal -DestUri "$($repoUri):$InvoiceTag" -DockerConfig $cfg
Tag-And-Push -LocalImage $MailingLocal -DestUri "$($repoUri):$MailingTag" -DockerConfig $cfg
Tag-And-Push -LocalImage $CaddyLocal   -DestUri "$($repoUri):$CaddyTag"   -DockerConfig $cfg

Write-Host "`nDone. Image URIs:" -ForegroundColor Yellow
Write-Host "  $($repoUri):$AdminTag"
Write-Host "  $($repoUri):$InvoiceTag"
Write-Host "  $($repoUri):$MailingTag"
Write-Host "  $($repoUri):$CaddyTag"
