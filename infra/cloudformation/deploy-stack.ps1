Param(
  [Parameter(Mandatory=$true)][string]$StackName,
  [Parameter(Mandatory=$true)][string]$KeyName,
  [Parameter(Mandatory=$true)][string]$DBPassword,
  [string]$AllowedCidr = "0.0.0.0/0",
  [string]$StackNameSuffix = "invoice",
  [string]$TemplatePath = "infra/cloudformation/backend-stack.yaml",
  [string]$Region = "us-east-2"
)

$ErrorActionPreference = 'Stop'

aws cloudformation deploy `
  --region $Region `
  --template-file $TemplatePath `
  --stack-name $StackName `
  --capabilities CAPABILITY_IAM `
  --parameter-overrides `
    KeyName=$KeyName `
    AllowedCidr=$AllowedCidr `
    DBPassword=$DBPassword `
    StackNameSuffix=$StackNameSuffix

Write-Host "Deployed stack: $StackName" -ForegroundColor Green
