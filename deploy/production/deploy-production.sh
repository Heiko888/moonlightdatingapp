#!/bin/bash

# HD App Production Deployment Script
set -e

APP_NAME="hd-app"
DOCKER_COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE="backend/.env.production"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_requirements() {
    log_info "Checking deployment requirements..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed."
        exit 1
    fi
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error "Environment file $ENV_FILE not found."
        exit 1
    fi
    
    log_success "All requirements checked successfully."
}

deploy_docker() {
    log_info "Deploying with Docker Compose..."
    
    docker-compose -f "$DOCKER_COMPOSE_FILE" down --remove-orphans
    docker-compose -f "$DOCKER_COMPOSE_FILE" pull
    docker-compose -f "$DOCKER_COMPOSE_FILE" up -d --build
    
    sleep 30
    check_service_health
    log_success "Docker deployment completed."
}

check_service_health() {
    log_info "Checking service health..."
    
    if curl -f http://localhost:3001/health > /dev/null 2>&1; then
        log_success "Backend is healthy"
    else
        log_error "Backend health check failed"
        exit 1
    fi
    
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log_success "Frontend is healthy"
    else
        log_error "Frontend health check failed"
        exit 1
    fi
}

main() {
    log_info "Starting HD App Production Deployment..."
    
    check_requirements
    deploy_docker
    
    log_success "🎉 HD App Production Deployment Completed!"
    log_info "Backend: http://localhost:3001"
    log_info "Frontend: http://localhost:3000"
}

trap 'log_error "Deployment failed at line $LINENO"' ERR
main "$@"