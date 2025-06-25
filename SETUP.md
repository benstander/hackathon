# Finance GPT Setup Guide

## Environment Variables Required

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Backend (.env)
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Basiq API Configuration
BASIQ_API_KEY=your_basiq_api_key

# Server Configuration
PORT=3000

# OpenAI/Groq Configuration (if using)
GROQ_API_KEY=your_groq_api_key
```

## How to Get Supabase JWT Secret

The `SUPABASE_JWT_SECRET` is required for backend authentication. To get it:

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Scroll down to **JWT Settings**
4. Copy the **JWT Secret** (this is different from the anon key and service role key)

## Authentication Flow

The application now requires users to be authenticated before they can connect their bank accounts:

1. **User signs up/logs in** via Supabase Auth
2. **User is redirected to main page** after successful authentication
3. **User can then connect bank account** - all bank connection requests now include authentication tokens
4. **Backend validates JWT tokens** before allowing any bank operations

## Security Features

- All bank connection endpoints require authentication
- Users can only access their own data
- JWT tokens are validated on every request
- Row Level Security (RLS) policies are enforced

## Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Start the frontend server:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3001
   - Backend: http://localhost:3000

## Database Setup

Make sure you've run the SQL schema in your Supabase database:

```sql
-- Run this in your Supabase SQL editor
-- (The schema is in backend/db/schema.sql)
```

## Troubleshooting

### Authentication Errors
- Ensure `SUPABASE_JWT_SECRET` is set correctly in backend `.env`
- Verify the JWT secret matches the one in your Supabase dashboard
- Check that the frontend is sending authentication tokens

### Bank Connection Errors
- Users must be authenticated before connecting banks
- Check that the user is logged in before attempting bank connection
- Verify Basiq API key is correctly base64 encoded

### Database Errors
- Ensure RLS policies are set up correctly
- Verify the service role key has proper permissions
- Check that the database schema is properly applied 