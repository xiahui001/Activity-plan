$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = "C:\Users\Mia\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$bundledNodeModules = "C:\Users\Mia\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules"
$envFile = Join-Path $scriptDir ".env.local"

if (Test-Path $envFile) {
  foreach ($rawLine in Get-Content $envFile) {
    $line = $rawLine.Trim()
    if ($line -eq "" -or $line.StartsWith("#") -or -not $line.Contains("=")) {
      continue
    }

    $parts = $line -split "=", 2
    $key = $parts[0].Trim()
    $value = ""
    if ($parts.Length -gt 1) {
      $value = $parts[1].Trim().Trim('"').Trim("'")
    }

    if ($key -ne "") {
      [Environment]::SetEnvironmentVariable($key, $value, "Process")
    }
  }
}

if (-not $env:PORT) {
  $env:PORT = "4000"
}

if (Test-Path $bundledNode) {
  $nodeCommand = $bundledNode
} elseif (Get-Command node -ErrorAction SilentlyContinue) {
  $nodeCommand = "node"
} else {
  Write-Host "Node.js was not found. Install Node.js or reinstall the Codex workspace runtime." -ForegroundColor Red
  exit 1
}

if (-not $env:ARK_API_KEY) {
  Write-Host "ARK_API_KEY is missing. Fill it in .env.local, then run this script again." -ForegroundColor Yellow
  Write-Host "Example: ARK_API_KEY=your_doubao_ark_api_key" -ForegroundColor Yellow
  exit 1
}

$env:NODE_PATH = $bundledNodeModules
Write-Host "Starting poster/proposal assistant..." -ForegroundColor Cyan
Write-Host "Poster assistant:   http://localhost:$env:PORT" -ForegroundColor Cyan
Write-Host "Proposal assistant: http://localhost:$env:PORT/proposal.html" -ForegroundColor Cyan
& $nodeCommand (Join-Path $scriptDir "server.mjs")
