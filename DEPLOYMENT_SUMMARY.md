# Natuzap - Deployment Summary

## Render Deployment Files
- `render.yaml` - Configuration for deploying to Render
- `.env.render` - Example environment variables for Render deployment

## Hostinger Deployment Files
- `HOSTINGER_DEPLOY.md` - Instructions for deploying to Hostinger

## Docker Files (Alternative Deployment)
- `Dockerfile.backend` - Docker configuration for the backend
- `Dockerfile.frontend` - Docker configuration for the frontend

## Configuration Files
- `Procfile` - Process file for Heroku/Render deployment
- `DEPLOYMENT_GUIDE.md` - Complete deployment guide

## Environment Variables Needed
For both Render and Hostinger deployments, you'll need to configure these environment variables:

### Supabase (Database)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

### Authentication
- JWT_SECRET

### Twilio (WhatsApp Integration)
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER

### Frontend (VITE variables)
- VITE_API_URL (should point to your backend URL)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Deployment Steps Summary

1. Set up your Supabase project and get the required credentials
2. Set up your Twilio account and configure the WhatsApp sandbox
3. Choose your deployment platform (Render or Hostinger)
4. Follow the specific instructions in either `render.yaml` or `HOSTINGER_DEPLOY.md`
5. Configure all environment variables
6. Deploy both frontend and backend services
7. Update your Twilio webhook URL to point to your deployed backend
8. Test the application

For detailed instructions, refer to `DEPLOYMENT_GUIDE.md`.