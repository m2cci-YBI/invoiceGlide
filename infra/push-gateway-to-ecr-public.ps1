Param(
  [string]$Alias = "y0v6t3a3",                  # your ECR Public alias
  [string]$Repo  = "invoices",                  # single repo to hold all images
  [string]$RegionPublic = "us-east-1",          # ECR Public auth region (fixed)
  [string]$GatewayLocal = "backend-gateway",    # local image name (defaults to :latest)
  [string]$GatewayTag   = "gateway-latest"      # tag to use in the single repo
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
  $token = (aws ecr-public get-login-password --region $RegionPublic).Trim()
  if (-not $token) { throw "Failed to obtain ECR Public login token." }
  $authB64 = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("AWS:$token"))
  $cfg = Join-Path $env:TEMP ("docker-auth-public-" + (Get-Date -Format "yyyyMMddHHmmss"))
  New-Item -ItemType Directory -Force -Path $cfg | Out-Null
  $json = '{"auths":{"public.ecr.aws":{"auth":"' + $authB64 + '"}}}'
  $json | Out-File -Encoding ascii -FilePath (Join-Path $cfg "config.json")
  return $cfg
}

function Tag-And-Push {
  param([string]$LocalImage,[string]$DestUri,[string]$DockerConfig)
  try { docker image inspect $LocalImage | Out-Null } catch { $LocalImage = "$LocalImage`:latest"; docker image inspect $LocalImage | Out-Null }
  Write-Host "Tagging $LocalImage -> $DestUri" -ForegroundColor Cyan
  docker tag $LocalImage $DestUri
  Write-Host "Pushing $DestUri" -ForegroundColor Green
  docker --config $DockerConfig push $DestUri
}

$repoUri = "public.ecr.aws/$Alias/$Repo"
Write-Host "Using repository: $repoUri" -ForegroundColor Magenta
Ensure-EcrPublicRepo -Name $Repo
$cfg = New-TempDockerConfig
Tag-And-Push -LocalImage $GatewayLocal -DestUri "$($repoUri):$GatewayTag" -DockerConfig $cfg
Write-Host "`nDone. Image URI: $($repoUri):$GatewayTag" -ForegroundColor Yellow

