# Fix SSL Certificates and Nginx on Hetzner
$server = "root@138.199.237.34"
$path = "/opt/hd-app/HD_App_chart"
$domain = "www.the-connection-key.de"

Write-Host "=== Fixing SSL Certificates ===" -ForegroundColor Green

# Check if certificates exist
Write-Host "`nChecking for SSL certificates..." -ForegroundColor Yellow
$certCheck = ssh $server "test -f /etc/letsencrypt/live/$domain/fullchain.pem && echo 'EXISTS' || echo 'MISSING'"

if ($certCheck -match "MISSING") {
    Write-Host "SSL certificates are missing. Attempting to create them..." -ForegroundColor Red
    
    # Stop nginx first
    Write-Host "Stopping Nginx..." -ForegroundColor Yellow
    ssh $server "cd $path && docker compose -f docker-compose.supabase.yml stop nginx"
    
    # Install certbot if not installed
    Write-Host "Checking/Installing Certbot..." -ForegroundColor Yellow
    ssh $server "which certbot > /dev/null 2>&1 || (apt-get update -qq && apt-get install -y -qq certbot)"
    
    # Create certificates (standalone mode since nginx is stopped)
    Write-Host "Creating SSL certificates..." -ForegroundColor Yellow
    $certResult = ssh $server "certbot certonly --standalone -d $domain -d the-connection-key.de --non-interactive --agree-tos --email admin@the-connection-key.de 2>&1"
    
    if ($certResult -match "Successfully received certificate") {
        Write-Host "Certificates created successfully!" -ForegroundColor Green
    } else {
        Write-Host "Certificate creation may have failed. Check output:" -ForegroundColor Yellow
        Write-Host $certResult
    }
    
    # Restart nginx
    Write-Host "Restarting Nginx..." -ForegroundColor Yellow
    ssh $server "cd $path && docker compose -f docker-compose.supabase.yml start nginx"
} else {
    Write-Host "SSL certificates exist. Restarting Nginx..." -ForegroundColor Green
    ssh $server "cd $path && docker compose -f docker-compose.supabase.yml restart nginx"
}

Write-Host "`n=== Done ===" -ForegroundColor Green
Write-Host "Test: https://$domain" -ForegroundColor Cyan

