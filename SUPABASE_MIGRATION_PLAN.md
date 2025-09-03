# Supabase Migration Notes

## Current Status
- Backend is using NestJS with TypeORM.
- Frontend is using Vite/React.

## Future Migration Plan

### 1. Database Schema
- The schema is partially defined in `backend/src/migrations/SCHEMA.sql`.
- When migrating, create tables in Supabase based on this schema and the TypeORM entities.

### 2. Frontend Integration
- The Supabase client is installed (`@supabase/supabase-js`).
- A basic client is set up in `frontend/src/lib/supabaseClient.ts`.
- A service example is in `frontend/src/services/supabaseService.ts`.

### 3. Backend Replacement
- Replace NestJS API endpoints with Supabase REST API or custom Edge Functions.
- Authentication will be handled by Supabase Auth.
- Webhooks (e.g., WhatsApp) will be handled by Supabase Edge Functions.

### 4. Edge Functions
- A placeholder directory is created in `supabase/functions`.
- An example for a WhatsApp webhook handler is provided in `supabase/functions/README.md`.

### 5. Environment Variables
- Frontend will need `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Edge Functions will need `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.