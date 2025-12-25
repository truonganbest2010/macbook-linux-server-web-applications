#!/bin/bash

# ============================================
# MeatBird - Rebuild Script
# Destroys and rebuilds all Docker containers
# ============================================

echo "🍗 MeatBird Rebuild Script"
echo "=========================="
echo ""

# Stop and remove containers, networks, volumes
echo "🛑 Stopping and removing containers..."
docker-compose down

# Remove old images (optional - uncomment if you want fresh images)
# echo "🗑️  Removing old images..."
# docker-compose down --rmi all

# Rebuild and start containers
echo ""
echo "🔨 Rebuilding containers..."
docker-compose up --build -d

# Wait a moment for containers to start
echo ""
echo "⏳ Waiting for containers to start..."
sleep 3

# Check status
echo ""
echo "📊 Container Status:"
docker-compose ps

# Show access URLs
echo ""
echo "✅ MeatBird is running!"
echo ""
echo "   🌐 Web App:  http://localhost:3000"
echo "   📚 API Docs: http://localhost:3030/docs"
echo ""
echo "   View logs:   docker-compose logs -f"
echo "   Stop:        docker-compose down"
echo ""

