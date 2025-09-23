# Clean Upload Script for Hetzner Server - ASCII only, no encoding issues
param(
    [Parameter(Mandatory=$true)][string]$ServerIP,
    [Parameter(Mandatory=$true)][string]$Username,
    [string]$LocalRoot = "C:\AppProgrammierung\Projekte\HD_App_chart",
    [string]$RemoteRoot = "/opt/hd-app/HD_App_chart"
)

# Set UTF-8 encoding
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$ErrorActionPreference = "Stop"

Write-Host "Starting upload to Hetzner Server: $ServerIP" -ForegroundColor Blue

# Check required tools
function Require-Tool($name) {
    if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
        throw "Tool not found: $name. Please install OpenSSH for Windows."
    }
}
Require-Tool "ssh"
Require-Tool "scp"

# Test connection
Write-Host "Testing connection to server..." -ForegroundColor Yellow
try {
    ssh "$Username@$ServerIP" "echo 'Connection successful'"
    Write-Host "Connection successful!" -ForegroundColor Green
} catch {
    Write-Host "Connection failed! Please check:" -ForegroundColor Red
    Write-Host "  - Server IP: $ServerIP" -ForegroundColor Red
    Write-Host "  - Username: $Username" -ForegroundColor Red
    Write-Host "  - SSH key configured" -ForegroundColor Red
    exit 1
}

# Create remote directory
Write-Host "Creating remote directory structure..." -ForegroundColor Blue
ssh "$Username@$ServerIP" "mkdir -p $RemoteRoot"

# Files to upload
$FilesToUpload = @(
    "docker-compose.supabase.yml",
    "env.supabase",
    "deploy-hetzner.sh",
    "HETZNER-DEPLOYMENT.md"
)

# Directories to upload
$DirectoriesToUpload = @(
    "backend",
    "frontend",
    "grafana",
    "prometheus"
)

# Upload files
Write-Host "Uploading files..." -ForegroundColor Blue
foreach ($file in $FilesToUpload) {
    $src = Join-Path $LocalRoot $file
    if (Test-Path $src) {
        Write-Host "  Uploading: $file" -ForegroundColor Yellow
        scp $src "$Username@$ServerIP`:$RemoteRoot/"
    } else {
        Write-Host "  Skip (not found): $file" -ForegroundColor DarkYellow
    }
}

# Upload directories
Write-Host "Uploading directories..." -ForegroundColor Blue
foreach ($dir in $DirectoriesToUpload) {
    $src = Join-Path $LocalRoot $dir
    if (Test-Path $src) {
        Write-Host "  Uploading: $dir" -ForegroundColor Yellow
        scp -r $src "$Username@$ServerIP`:$RemoteRoot/"
    } else {
        Write-Host "  Skip (not found): $dir" -ForegroundColor DarkYellow
    }
}

# Make deployment script executable
Write-Host "Making deployment script executable..." -ForegroundColor Blue
ssh "$Username@$ServerIP" "chmod +x $RemoteRoot/deploy-hetzner.sh"

Write-Host "Upload completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Login to server: ssh $Username@$ServerIP" -ForegroundColor White
Write-Host "2. Navigate to app: cd $RemoteRoot" -ForegroundColor White
Write-Host "3. Run deployment: ./deploy-hetzner.sh" -ForegroundColor White
Write-Host ""
Write-Host "After deployment, your app will be available at:" -ForegroundColor Cyan
Write-Host "  Main App: http://$ServerIP" -ForegroundColor White
Write-Host "  Grafana:  http://$ServerIP/grafana/" -ForegroundColor White
Write-Host "  Prometheus: http://$ServerIP/prometheus/" -ForegroundColor White
