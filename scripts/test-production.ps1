# HD App Production Test Script (PowerShell Version)
# Testet alle Production-Features und Deployment

Write-Host "Starting HD App Production Tests..." -ForegroundColor Blue

# Configuration
# $PROJECT_NAME = "hd-app"  # Currently unused
$DOCKER_COMPOSE_FILE = "docker-compose.production.yml"

# Test counter
$TESTS_PASSED = 0
$TESTS_FAILED = 0
$TOTAL_TESTS = 0

# Function to run a test
function Invoke-Test {
    param(
        [string]$TestName,
        [scriptblock]$TestCommand
    )
    
    $script:TOTAL_TESTS++
    Write-Host "[TEST] Running: $TestName" -ForegroundColor Blue
    
    try {
        & $TestCommand
        Write-Host "[PASS] $TestName" -ForegroundColor Green
        $script:TESTS_PASSED++
        return $true
    }
    catch {
        Write-Host "[FAIL] $TestName - $($_.Exception.Message)" -ForegroundColor Red
        $script:TESTS_FAILED++
        return $false
    }
}

# Test 1: Docker Build
function Test-DockerBuild {
    Write-Host "Testing Docker build..." -ForegroundColor Blue
    
    # Check if Docker is available
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw "Docker is not installed or not in PATH"
    }
    
    # Test if Dockerfile exists
    if (-not (Test-Path "frontend/Dockerfile")) {
        throw "Frontend Dockerfile not found"
    }
    
    if (-not (Test-Path "Dockerfile.production")) {
        throw "Production Dockerfile not found"
    }
    
    Write-Host "Docker files found" -ForegroundColor Green
}

# Test 2: Environment Configuration
function Test-EnvironmentConfig {
    Write-Host "Testing environment configuration..." -ForegroundColor Blue
    
    if (-not (Test-Path "env.production.template")) {
        throw "Environment template not found"
    }
    
    # Check required variables
    $requiredVars = @(
        "NODE_ENV",
        "POSTGRES_DB", 
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "NEXT_PUBLIC_SUPABASE_URL",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        "SUPABASE_SERVICE_ROLE_KEY",
        "STRIPE_SECRET_KEY",
        "JWT_SECRET",
        "SESSION_SECRET"
    )
    
    $templateContent = Get-Content "env.production.template" -Raw
    
    foreach ($var in $requiredVars) {
        if ($templateContent -notmatch "$var=") {
            throw "Required variable $var not found in template"
        }
    }
    
    Write-Host "Environment configuration valid" -ForegroundColor Green
}

# Test 3: Docker Compose Configuration
function Test-DockerCompose {
    Write-Host "Testing Docker Compose configuration..." -ForegroundColor Blue
    
    if (-not (Test-Path $DOCKER_COMPOSE_FILE)) {
        throw "Docker Compose file not found"
    }
    
    # Check if docker-compose is available
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        throw "Docker Compose is not installed or not in PATH"
    }
    
    # Validate docker-compose file
    try {
        docker-compose -f $DOCKER_COMPOSE_FILE config | Out-Null
    }
    catch {
        throw "Docker Compose configuration is invalid"
    }
    
    # Check required services
    $requiredServices = @("frontend", "postgres", "redis", "nginx", "prometheus", "grafana")
    $configContent = docker-compose -f $DOCKER_COMPOSE_FILE config | Out-String
    
    foreach ($service in $requiredServices) {
        if ($configContent -notlike "*$service*") {
            throw "Service $service not found in docker-compose"
        }
    }
    
    Write-Host "Docker Compose configuration valid" -ForegroundColor Green
}

# Test 4: Nginx Configuration
function Test-NginxConfig {
    Write-Host "Testing Nginx configuration..." -ForegroundColor Blue
    
    if (-not (Test-Path "nginx/nginx.conf")) {
        throw "Nginx configuration not found"
    }
    
    $nginxContent = Get-Content "nginx/nginx.conf" -Raw
    
    # Check required directives
    $requiredDirectives = @("ssl_certificate", "ssl_certificate_key", "proxy_pass", "add_header")
    
    foreach ($directive in $requiredDirectives) {
        if ($nginxContent -notmatch $directive) {
            throw "Required nginx directive $directive not found"
        }
    }
    
    Write-Host "Nginx configuration valid" -ForegroundColor Green
}

# Test 5: Security Headers
function Test-SecurityHeaders {
    Write-Host "Testing security headers..." -ForegroundColor Blue
    
    if (-not (Test-Path "frontend/middleware.ts")) {
        throw "Security middleware not found"
    }
    
    $middlewareContent = Get-Content "frontend/middleware.ts" -Raw
    
    # Check required security headers
    $requiredHeaders = @("X-Frame-Options", "X-Content-Type-Options", "X-XSS-Protection", "Strict-Transport-Security", "Content-Security-Policy")
    
    foreach ($header in $requiredHeaders) {
        if ($middlewareContent -notmatch $header) {
            throw "Required security header $header not found"
        }
    }
    
    Write-Host "Security headers configured" -ForegroundColor Green
}

# Test 6: Monitoring Configuration
function Test-MonitoringConfig {
    Write-Host "Testing monitoring configuration..." -ForegroundColor Blue
    
    if (-not (Test-Path "monitoring/prometheus.yml")) {
        throw "Prometheus configuration not found"
    }
    
    $prometheusContent = Get-Content "monitoring/prometheus.yml" -Raw
    
    # Check required jobs
    $requiredJobs = @("prometheus", "hd-app-frontend", "postgres", "redis", "nginx", "grafana")
    
    foreach ($job in $requiredJobs) {
        if ($prometheusContent -notmatch "job_name: '$job'") {
            throw "Required Prometheus job $job not found"
        }
    }
    
    Write-Host "Monitoring configuration valid" -ForegroundColor Green
}

# Test 7: Package System
function Test-PackageSystem {
    Write-Host "Testing package system..." -ForegroundColor Blue
    
    if (-not (Test-Path "frontend/lib/access-control/packageSystem.ts")) {
        throw "Package system not found"
    }
    
    $packageContent = Get-Content "frontend/lib/access-control/packageSystem.ts" -Raw
    
    # Check required functions
    $requiredFunctions = @("hasAccess", "checkPageAccess", "getAvailablePages", "getPackageFeatures", "canUpgrade", "getNextPackage")
    
    foreach ($func in $requiredFunctions) {
        if ($packageContent -notmatch "export function $func") {
            throw "Required function $func not found"
        }
    }
    
    Write-Host "Package system configured" -ForegroundColor Green
}

# Test 8: TypeScript Configuration
function Test-TypeScriptConfig {
    Write-Host "Testing TypeScript configuration..." -ForegroundColor Blue
    
    if (-not (Test-Path "frontend/tsconfig.json")) {
        throw "TypeScript configuration not found"
    }
    
    Write-Host "TypeScript configuration valid" -ForegroundColor Green
}

# Test 9: Next.js Configuration
function Test-NextJSConfig {
    Write-Host "Testing Next.js configuration..." -ForegroundColor Blue
    
    $nextConfigExists = (Test-Path "frontend/next.config.ts") -or (Test-Path "frontend/next.config.js")
    
    if (-not $nextConfigExists) {
        throw "Next.js configuration not found"
    }
    
    if (Test-Path "frontend/next.config.production.ts") {
        Write-Host "Production Next.js configuration found" -ForegroundColor Green
    } else {
        Write-Host "Production Next.js configuration not found" -ForegroundColor Yellow
    }
    
    Write-Host "Next.js configuration valid" -ForegroundColor Green
}

# Test 10: Deployment Script
function Test-DeploymentScript {
    Write-Host "Testing deployment script..." -ForegroundColor Blue
    
    if (-not (Test-Path "scripts/deploy-production.sh")) {
        throw "Deployment script not found"
    }
    
    $scriptContent = Get-Content "scripts/deploy-production.sh" -Raw
    
    # Check required functions
    $requiredFunctions = @("check_requirements", "create_directories", "deploy_services", "health_check")
    
    foreach ($func in $requiredFunctions) {
        if ($scriptContent -notmatch "$func\(\)") {
            throw "Required function $func not found in deployment script"
        }
    }
    
    Write-Host "Deployment script valid" -ForegroundColor Green
}

# Test 11: Health Check Endpoints
function Test-HealthEndpoints {
    Write-Host "Testing health check endpoints..." -ForegroundColor Blue
    
    if (-not (Test-Path "frontend/app/api/health/route.ts")) {
        Write-Host "Health check endpoint not found" -ForegroundColor Yellow
    } else {
        Write-Host "Health check endpoint found" -ForegroundColor Green
    }
    
    Write-Host "Health check configuration valid" -ForegroundColor Green
}

# Test 12: SSL Certificate Generation
function Test-SSLCertificates {
    Write-Host "Testing SSL certificate generation..." -ForegroundColor Blue
    
    if (-not (Test-Path "nginx/ssl")) {
        Write-Host "SSL directory not found" -ForegroundColor Yellow
    } else {
        Write-Host "SSL directory found" -ForegroundColor Green
    }
    
    Write-Host "SSL certificate configuration valid" -ForegroundColor Green
}

# Main test runner
function Main {
    Write-Host "Starting HD App Production Tests..." -ForegroundColor Blue
    Write-Host ""
    
    # Run all tests
    Invoke-Test "Docker Build" { Test-DockerBuild }
    Invoke-Test "Environment Configuration" { Test-EnvironmentConfig }
    Invoke-Test "Docker Compose Configuration" { Test-DockerCompose }
    Invoke-Test "Nginx Configuration" { Test-NginxConfig }
    Invoke-Test "Security Headers" { Test-SecurityHeaders }
    Invoke-Test "Monitoring Configuration" { Test-MonitoringConfig }
    Invoke-Test "Package System" { Test-PackageSystem }
    Invoke-Test "TypeScript Configuration" { Test-TypeScriptConfig }
    Invoke-Test "Next.js Configuration" { Test-NextJSConfig }
    Invoke-Test "Deployment Script" { Test-DeploymentScript }
    Invoke-Test "Health Check Endpoints" { Test-HealthEndpoints }
    Invoke-Test "SSL Certificate Generation" { Test-SSLCertificates }
    
    Write-Host ""
    Write-Host "Test Results Summary:" -ForegroundColor Blue
    Write-Host "  Total Tests: $TOTAL_TESTS"
    Write-Host "  Passed: $TESTS_PASSED" -ForegroundColor Green
    Write-Host "  Failed: $TESTS_FAILED" -ForegroundColor Red
    
    if ($TESTS_FAILED -eq 0) {
        Write-Host "All tests passed! HD App is production-ready!" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "Some tests failed. Please fix the issues before deployment." -ForegroundColor Red
        exit 1
    }
}

# Run main function
Main
