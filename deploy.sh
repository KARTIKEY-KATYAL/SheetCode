#!/bin/bash

set -e

echo "🚀 Starting deployment on 159.65.146.33..."

# Get current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📂 Current branch: $BRANCH"

# Pull latest changes from current branch
git pull origin $BRANCH

# Stop existing containers
echo "⏹️ Stopping existing containers..."
docker-compose -f docker-compose.production.yml down

# Remove old images
echo "🧹 Cleaning up old images..."
docker system prune -f

# Build and start services
echo "🏗️ Building and starting services..."
docker-compose -f docker-compose.production.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 90

# Run database migrations
echo "📊 Running database migrations..."
docker-compose -f docker-compose.production.yml exec -T backend npx prisma migrate deploy

# Check service status
echo "📋 Service status:"
docker-compose -f docker-compose.production.yml ps

echo "✅ Deployment complete!"
echo "🌐 Backend available at: http://159.65.146.33/api/v1"
echo "⚖️ Judge0 available at: http://159.65.146.33:2358"
echo "🔍 Health check: http://159.65.146.33/health"