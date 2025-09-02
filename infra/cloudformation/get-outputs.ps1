Param(
  [Parameter(Mandatory=$true)][string]$StackName,
  [string]$Region = "us-east-2"
)

$ErrorActionPreference = 'Stop'

$stack = aws cloudformation describe-stacks --region $Region --stack-name $StackName | ConvertFrom-Json
$outputs = @{}
foreach ($o in $stack.Stacks[0].Outputs) {
  $outputs[$o.OutputKey] = $o.OutputValue
}
$outputs.GetEnumerator() | Sort-Object Name | Format-Table -AutoSize
