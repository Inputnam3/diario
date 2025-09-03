# Complete deployment guide for Natuzap

## Prerequisites
1. GitHub account
2. Render account (for deployment) or Hostinger account (alternative deployment)
3. Supabase account
4. Twilio account

## Setting up credentials

Before deploying, you need to obtain credentials from Supabase, Twilio, and create a secure JWT secret.

### Supabase Setup
1. Create a new Supabase project at https://app.supabase.com/
2. Navigate to Project Settings > API
3. Copy the following values:
   - Project URL (SUPABASE_URL)
   - Anonymous key (SUPABASE_ANON_KEY)
   - Service role key (SUPABASE_SERVICE_ROLE_KEY)
4. Navigate to Project Settings > Database
5. Copy the Connection String (SUPABASE_DB_URL)

### Twilio Setup
1. Create a Twilio account at https://www.twilio.com/
2. Navigate to the Console Dashboard
3. Copy the following values:
   - Account SID (TWILIO_ACCOUNT_SID)
   - Auth Token (TWILIO_AUTH_TOKEN)
4. Navigate to Messaging > Settings > WhatsApp Sandbox Settings
5. Note your WhatsApp sandbox number (TWILIO_PHONE_NUMBER)

### Generate JWT Secret
Create a secure random string for your JWT secret. You can use:
- A password generator
- OpenSSL: `openssl rand -base64 32`
- Node.js: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## Configure environment files

### Backend
Update `backend/.env.production` with your actual values:
```
NODE_ENV=production
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DB_URL=your_supabase_database_connection_string
JWT_SECRET=your_secure_random_jwt_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number
```

### Frontend
Update `frontend/.env.production` with your actual values:
```
VITE_API_URL=https://your-backend-domain.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run database migrations

Before deploying, ensure your Supabase database is set up with the correct schema:

1. Install Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Link to your Supabase project:
   ```bash
   supabase link --project-ref your_project_id
   ```

3. Run the migrations:
   ```bash
   supabase db push
   ```

## Render Deployment

### Backend Deployment
1. Fork this repository to your GitHub account
2. Go to https://render.com and create a new Web Service
3. Connect your GitHub account and select your forked repository
4. Configure the service:
   - Name: natuzap-backend
   - Environment: Node
   - Root directory: backend
   - Build command: `npm run build`
   - Start command: `node dist/main.js`
   - Plan: Free
5. Add environment variables from your `backend/.env.production` file
6. Click "Create Web Service"

### Frontend Deployment
1. Create a new Static Site on Render
2. Connect the same GitHub repository
3. Configure the site:
   - Name: natuzap-frontend
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables:
   - VITE_API_URL: Your deployed backend URL (e.g., https://natuzap-backend.onrender.com)
   - VITE_SUPABASE_URL: Your Supabase project URL
   - VITE_SUPABASE_ANON_KEY: Your Supabase anon key

## Hostinger Deployment

### Backend Deployment
1. Log in to your Hostinger account
2. Go to "Hosting" and select your plan
3. Navigate to "Websites" and click "Quick Install"
4. Choose "Node.js" as the application type
5. Set the application directory to the root of this project
6. Set the startup file to `backend/dist/main.js`
7. Configure environment variables from your `backend/.env.production` file

### Frontend Deployment
1. Build the frontend locally:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
2. Upload the contents of `frontend/dist` to your Hostinger file manager
3. Configure your domain to point to the uploaded files

## Docker Deployment

If you prefer to use Docker:

1. Build the backend image:
   ```bash
   docker build -f Dockerfile.backend -t natuzap-backend .
   ```

2. Build the frontend image:
   ```bash
   docker build -f Dockerfile.frontend -t natuzap-frontend .
   ```

3. Run the containers:
   ```bash
   docker run -p 3000:3000 --env-file backend/.env.production natuzap-backend
   docker run -p 3001:80 natuzap-frontend
   ```

## Post-Deployment Configuration

1. Update your Twilio webhook URL to point to your deployed backend
2. Ensure your Supabase project has the correct CORS settings for your frontend domain
3. Test the WhatsApp integration by sending a message to your Twilio number
4. Verify that the dashboard loads correctly and shows data