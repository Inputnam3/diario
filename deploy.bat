@echo off
REM Deployment script for Natuzap (Windows version)

echo === Natuzap Deployment Script ===

REM 1. Build backend
echo 1. Building backend...
cd backend
npm run build
if %errorlevel% neq 0 (
  echo Error building backend
  exit /b 1
)
cd ..

REM 2. Build frontend
echo 2. Building frontend...
cd frontend
npm run build
if %errorlevel% neq 0 (
  echo Error building frontend
  exit /b 1
)
cd ..

REM 3. Verify builds
echo 3. Verifying builds...
if not exist "backend\dist" (
  echo Error: backend\dist directory not found
  exit /b 1
)

if not exist "frontend\dist" (
  echo Error: frontend\dist directory not found
  exit /b 1
)

echo Builds completed successfully!

REM 4. Instructions for deployment
echo.
echo === Deployment Instructions ===
echo 1. Ensure you have set up your Supabase and Twilio accounts
echo 2. Update the .env.production files with your actual credentials:
echo    - backend\.env.production
echo    - frontend\.env.production
echo 3. For Render deployment:
echo    - Push your code to GitHub
echo    - Connect to Render using the render.yaml configuration
echo 4. For Hostinger deployment:
echo    - Follow the instructions in HOSTINGER_DEPLOY.md
echo 5. For Docker deployment:
echo    - Use Dockerfile.backend and Dockerfile.frontend
echo.
echo Deployment preparation completed!