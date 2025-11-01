# Synchronisiere Server mit GitHub
$ServerIP = "138.199.237.34"
$ServerPath = "/opt/hd-app/HD_App_chart"

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  SERVER SYNC - GitHub Repository" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Pruefe Server Git Status..." -ForegroundColor Yellow
$statusCmd = "cd $ServerPath; git status --short"
$status = ssh root@$ServerIP $statusCmd
if ($status) {
    Write-Host "Status: $status" -ForegroundColor Gray
} else {
    Write-Host "Status: Sauber (keine lokalen Aenderungen)" -ForegroundColor Green
}
Write-Host ""

Write-Host "2. Aktueller Commit auf Server..." -ForegroundColor Yellow
$currentCommitCmd = "cd $ServerPath; git rev-parse --short HEAD"
$serverCommit = ssh root@$ServerIP $currentCommitCmd
Write-Host "Server Commit: $serverCommit" -ForegroundColor Gray

$localCommitCmd = "git rev-parse --short HEAD"
$localCommit = Invoke-Expression $localCommitCmd
Write-Host "Lokaler Commit: $localCommit" -ForegroundColor Gray
Write-Host ""

if ($serverCommit -eq $localCommit) {
    Write-Host "Server ist bereits auf dem neuesten Stand!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "3. Hole neueste Aenderungen von GitHub..." -ForegroundColor Yellow
    $fetchCmd = "cd $ServerPath; git fetch origin main"
    ssh root@$ServerIP $fetchCmd
    
    Write-Host "4. Puelle neuesten Code..." -ForegroundColor Yellow
    $pullCmd = "cd $ServerPath; git pull origin main"
    $pullResult = ssh root@$ServerIP $pullCmd
    Write-Host $pullResult
    
    Write-Host ""
    Write-Host "5. Neuer Commit auf Server..." -ForegroundColor Yellow
    $newCommitCmd = "cd $ServerPath; git rev-parse --short HEAD"
    $newServerCommit = ssh root@$ServerIP $newCommitCmd
    Write-Host "Neuer Server Commit: $newServerCommit" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "6. Zeige letzte Commit-Info..." -ForegroundColor Yellow
    $logCmd = "cd $ServerPath; git log -1 --oneline"
    $logInfo = ssh root@$ServerIP $logCmd
    Write-Host $logInfo
    Write-Host ""
    
    Write-Host "7. Zeige geaenderte Dateien..." -ForegroundColor Yellow
    $diffCmd = "cd $ServerPath; git diff HEAD~1 --name-only | head -10"
    $changedFiles = ssh root@$ServerIP $diffCmd
    if ($changedFiles) {
        Write-Host $changedFiles
    }
    Write-Host ""
}

Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  SYNC ABGESCHLOSSEN" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

