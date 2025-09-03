#!/bin/bash
# Deployment script for Natuzap

echo "=== Natuzap Deployment Script ==="

# 1. Build backend
echo "1. Building backend..."
cd backend
npm run build
if [ $? -ne 0 ]; then
  echo "Error building backend"
  exit 1
fi
cd ..

# 2. Build frontend
echo "2. Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
  echo "Error building frontend"
  exit 1
fi
cd ..

# 3. Verify builds
echo "3. Verifying builds..."
if [ ! -d "backend/dist" ]; then
  echo "Error: backend/dist directory not found"
  exit 1
fi

if [ ! -d "frontend/dist" ]; then
  echo "Error: frontend/dist directory not found"
  exit 1
fi

echo "Builds completed successfully!"

# 4. Instructions for deployment
echo ""
echo "=== Deployment Instructions ==="
echo "1. Ensure you have set up your Supabase and Twilio accounts"
echo "2. Update the .env.production files with your actual credentials:"
echo "   - backend/.env.production"
echo "   - frontend/.env.production"
echo "3. For Render deployment:"
echo "   - Push your code to GitHub"
echo "   - Connect to Render using the render.yaml configuration"
echo "4. For Hostinger deployment:"
echo "   - Follow the instructions in HOSTINGER_DEPLOY.md"
echo "5. For Docker deployment:"
echo "   - Use Dockerfile.backend and Dockerfile.frontend"
echo ""
echo "Deployment preparation completed!"