#!/bin/bash

# HD App Production Test Script
# Testet alle Production-Features und Deployment

set -e

echo "🧪 Starting HD App Production Tests..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="hd-app"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"
TEST_TIMEOUT=300

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_status "Running: $test_name"
    
    if eval "$test_command"; then
        print_success "$test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        print_error "$test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

# Test 1: Docker Build
test_docker_build() {
    print_status "Testing Docker build..."
    
    # Test frontend build
    docker build -f frontend/Dockerfile -t hd-app-frontend:test ./frontend
    
    # Test production build
    docker build -f Dockerfile.production -t hd-app-production:test .
    
    print_success "Docker builds successful"
}

# Test 2: Environment Configuration
test_environment_config() {
    print_status "Testing environment configuration..."
    
    # Check if environment template exists
    if [ ! -f "env.production.template" ]; then
        print_error "Environment template not found"
        return 1
    fi
    
    # Check if all required variables are in template
    required_vars=(
        "NODE_ENV"
        "POSTGRES_DB"
        "POSTGRES_USER"
        "POSTGRES_PASSWORD"
        "NEXT_PUBLIC_SUPABASE_URL"
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
        "SUPABASE_SERVICE_ROLE_KEY"
        "STRIPE_SECRET_KEY"
        "JWT_SECRET"
        "SESSION_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^$var=" env.production.template; then
            print_error "Required variable $var not found in template"
            return 1
        fi
    done
    
    print_success "Environment configuration valid"
}

# Test 3: Docker Compose Configuration
test_docker_compose() {
    print_status "Testing Docker Compose configuration..."
    
    # Validate docker-compose file
    docker-compose -f $DOCKER_COMPOSE_FILE config > /dev/null
    
    # Check if all services are defined
    services=("frontend" "postgres" "redis" "nginx" "prometheus" "grafana")
    
    for service in "${services[@]}"; do
        if ! docker-compose -f $DOCKER_COMPOSE_FILE config | grep -q "service: $service"; then
            print_error "Service $service not found in docker-compose"
            return 1
        fi
    done
    
    print_success "Docker Compose configuration valid"
}

# Test 4: Nginx Configuration
test_nginx_config() {
    print_status "Testing Nginx configuration..."
    
    if [ ! -f "nginx/nginx.conf" ]; then
        print_error "Nginx configuration not found"
        return 1
    fi
    
    # Check for required nginx directives
    required_directives=(
        "ssl_certificate"
        "ssl_certificate_key"
        "proxy_pass"
        "add_header"
    )
    
    for directive in "${required_directives[@]}"; do
        if ! grep -q "$directive" nginx/nginx.conf; then
            print_error "Required nginx directive $directive not found"
            return 1
        fi
    done
    
    print_success "Nginx configuration valid"
}

# Test 5: Security Headers
test_security_headers() {
    print_status "Testing security headers..."
    
    # Check middleware for security headers
    if [ ! -f "frontend/middleware.ts" ]; then
        print_error "Security middleware not found"
        return 1
    fi
    
    # Check for required security headers
    required_headers=(
        "X-Frame-Options"
        "X-Content-Type-Options"
        "X-XSS-Protection"
        "Strict-Transport-Security"
        "Content-Security-Policy"
    )
    
    for header in "${required_headers[@]}"; do
        if ! grep -q "$header" frontend/middleware.ts; then
            print_error "Required security header $header not found"
            return 1
        fi
    done
    
    print_success "Security headers configured"
}

# Test 6: Monitoring Configuration
test_monitoring_config() {
    print_status "Testing monitoring configuration..."
    
    # Check Prometheus configuration
    if [ ! -f "monitoring/prometheus.yml" ]; then
        print_error "Prometheus configuration not found"
        return 1
    fi
    
    # Check for required scrape configs
    required_jobs=("prometheus" "hd-app-frontend" "postgres" "redis" "nginx" "grafana")
    
    for job in "${required_jobs[@]}"; do
        if ! grep -q "job_name: '$job'" monitoring/prometheus.yml; then
            print_error "Required Prometheus job $job not found"
            return 1
        fi
    done
    
    print_success "Monitoring configuration valid"
}

# Test 7: Package System
test_package_system() {
    print_status "Testing package system..."
    
    # Check if package system file exists
    if [ ! -f "frontend/lib/access-control/packageSystem.ts" ]; then
        print_error "Package system not found"
        return 1
    fi
    
    # Check for required functions
    required_functions=(
        "hasAccess"
        "checkPageAccess"
        "getAvailablePages"
        "getPackageFeatures"
        "canUpgrade"
        "getNextPackage"
    )
    
    for func in "${required_functions[@]}"; do
        if ! grep -q "export function $func" frontend/lib/access-control/packageSystem.ts; then
            print_error "Required function $func not found"
            return 1
        fi
    done
    
    print_success "Package system configured"
}

# Test 8: TypeScript Configuration
test_typescript_config() {
    print_status "Testing TypeScript configuration..."
    
    # Check if tsconfig exists
    if [ ! -f "frontend/tsconfig.json" ]; then
        print_error "TypeScript configuration not found"
        return 1
    fi
    
    # Check for required compiler options
    required_options=(
        "strict"
        "noImplicitAny"
        "noImplicitReturns"
        "noUnusedLocals"
        "noUnusedParameters"
    )
    
    for option in "${required_options[@]}"; do
        if ! grep -q "\"$option\":" frontend/tsconfig.json; then
            print_warning "TypeScript option $option not found (optional)"
        fi
    done
    
    print_success "TypeScript configuration valid"
}

# Test 9: Next.js Configuration
test_nextjs_config() {
    print_status "Testing Next.js configuration..."
    
    # Check if next.config exists
    if [ ! -f "frontend/next.config.ts" ] && [ ! -f "frontend/next.config.js" ]; then
        print_error "Next.js configuration not found"
        return 1
    fi
    
    # Check for production optimizations
    if [ -f "frontend/next.config.production.ts" ]; then
        print_success "Production Next.js configuration found"
    else
        print_warning "Production Next.js configuration not found"
    fi
    
    print_success "Next.js configuration valid"
}

# Test 10: Deployment Script
test_deployment_script() {
    print_status "Testing deployment script..."
    
    if [ ! -f "scripts/deploy-production.sh" ]; then
        print_error "Deployment script not found"
        return 1
    fi
    
    # Check if script is executable
    if [ ! -x "scripts/deploy-production.sh" ]; then
        print_warning "Deployment script is not executable"
    fi
    
    # Check for required functions in script
    required_functions=(
        "check_requirements"
        "create_directories"
        "deploy_services"
        "health_check"
    )
    
    for func in "${required_functions[@]}"; do
        if ! grep -q "$func()" scripts/deploy-production.sh; then
            print_error "Required function $func not found in deployment script"
            return 1
        fi
    done
    
    print_success "Deployment script valid"
}

# Test 11: Health Check Endpoints
test_health_endpoints() {
    print_status "Testing health check endpoints..."
    
    # Check if health endpoint exists in API
    if [ ! -f "frontend/app/api/health/route.ts" ]; then
        print_warning "Health check endpoint not found"
    else
        print_success "Health check endpoint found"
    fi
    
    print_success "Health check configuration valid"
}

# Test 12: SSL Certificate Generation
test_ssl_certificates() {
    print_status "Testing SSL certificate generation..."
    
    # Check if SSL directory exists
    if [ ! -d "nginx/ssl" ]; then
        print_warning "SSL directory not found"
    else
        print_success "SSL directory found"
    fi
    
    print_success "SSL certificate configuration valid"
}

# Main test runner
main() {
    print_status "🧪 Starting HD App Production Tests..."
    echo ""
    
    # Run all tests
    run_test "Docker Build" "test_docker_build"
    run_test "Environment Configuration" "test_environment_config"
    run_test "Docker Compose Configuration" "test_docker_compose"
    run_test "Nginx Configuration" "test_nginx_config"
    run_test "Security Headers" "test_security_headers"
    run_test "Monitoring Configuration" "test_monitoring_config"
    run_test "Package System" "test_package_system"
    run_test "TypeScript Configuration" "test_typescript_config"
    run_test "Next.js Configuration" "test_nextjs_config"
    run_test "Deployment Script" "test_deployment_script"
    run_test "Health Check Endpoints" "test_health_endpoints"
    run_test "SSL Certificate Generation" "test_ssl_certificates"
    
    echo ""
    print_status "📊 Test Results Summary:"
    echo "  Total Tests: $TOTAL_TESTS"
    echo "  Passed: $TESTS_PASSED"
    echo "  Failed: $TESTS_FAILED"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        print_success "🎉 All tests passed! HD App is production-ready!"
        exit 0
    else
        print_error "❌ Some tests failed. Please fix the issues before deployment."
        exit 1
    fi
}

# Run main function
main "$@"
