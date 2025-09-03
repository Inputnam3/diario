// Hostinger deployment configuration
// This file contains environment variables and deployment settings for Hostinger

// Frontend configuration
FRONTEND_PORT=3001
FRONTEND_BUILD_COMMAND="cd frontend && npm install && npm run build"
FRONTEND_START_COMMAND="cd frontend && npm run preview"

// Backend configuration
BACKEND_PORT=3000
BACKEND_BUILD_COMMAND="cd backend && npm install && npm run build"
BACKEND_START_COMMAND="cd backend && npm run start:prod"

// Common environment variables
NODE_ENV=production

// Note: You'll need to set these values in Hostinger's application settings:
// VITE_API_URL (should point to your backend URL)
// VITE_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY
// SUPABASE_URL
// SUPABASE_ANON_KEY
// SUPABASE_SERVICE_ROLE_KEY
// JWT_SECRET
// TWILIO_ACCOUNT_SID
// TWILIO_AUTH_TOKEN
// TWILIO_PHONE_NUMBER