Write-Host "Hetzner Container Status" -ForegroundColor Blue
Write-Host "========================" -ForegroundColor Blue
ssh root@138.199.237.34 'docker ps -a'

