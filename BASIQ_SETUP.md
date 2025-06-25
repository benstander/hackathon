# Basiq Integration Setup Guide

This guide explains how to complete the Basiq API integration for connecting real Australian bank accounts.

## Overview

The integration allows users to:
- Connect their Australian bank accounts securely through Basiq
- View real transaction data and account balances
- Get personalized financial insights based on actual spending patterns
- Sync account data automatically

## Prerequisites

1. **Basiq API Account**: Sign up at [Basiq.io](https://basiq.io) and get your API credentials
2. **Supabase Database**: Ensure your Supabase database is set up
3. **Environment Variables**: Configure all required API keys

## Setup Steps

### 1. Database Setup

Run the SQL schema in your Supabase database:

```sql
-- Execute the contents of backend/db/schema.sql in your Supabase SQL editor
-- This creates the necessary tables for users, bank connections, and accounts
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Basiq API Configuration
BASIQ_API_KEYS=your_basiq_api_key_base64_encoded

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq AI Configuration
GROQ_API_KEY=your_groq_api_key

# Backend Configuration
BACKEND_URL=http://localhost:8080
```

### 3. Basiq API Key Setup

1. Log into your Basiq dashboard
2. Navigate to API Settings
3. Copy your API Key
4. Encode it to Base64: `echo "your_api_key" | base64`
5. Add the Base64 encoded key to your environment variables

### 4. Supabase Configuration

Ensure your Supabase project has:
- Row Level Security (RLS) enabled
- The schema from `backend/db/schema.sql` applied
- API access configured with the correct environment variables

### 5. Start the Application

```bash
# Backend
cd backend
npm install
npm start

# Frontend  
cd frontend
npm install
npm run dev
```

## How It Works

### User Flow

1. **Authentication**: User signs up/logs in with Supabase Auth
2. **Bank Connection**: User clicks "Connect Bank" in the header
3. **Basiq Connect Widget**: Opens securely for bank selection and login
4. **Account Sync**: Bank accounts and transactions are automatically imported
5. **AI Insights**: Chat uses real transaction data for personalized advice

### Technical Flow

1. **Initialize Connection**: 
   - Creates Basiq user if needed
   - Generates client token for Connect widget

2. **Handle Connection Callback**:
   - Saves connection details to database
   - Syncs initial account and transaction data

3. **Data Usage**:
   - AI chat queries use real Basiq user ID
   - Fallback to demo data if no connection exists

### API Endpoints

#### Backend (Express.js)

- `POST /api/basiq/connect/init` - Initialize bank connection
- `POST /api/basiq/connect/callback` - Handle connection success
- `GET /api/basiq/connections/:userId` - Get user's connections
- `GET /api/basiq/accounts/:userId` - Get user's bank accounts
- `POST /api/basiq/sync/:userId` - Sync latest data

#### Frontend (Next.js API Routes)

- `POST /api/basiq/connect/init` - Proxy to backend init
- `POST /api/basiq/connect/callback` - Proxy to backend callback
- `GET /api/basiq/connections/[userId]` - Proxy to backend connections
- `GET /api/basiq/accounts/[userId]` - Proxy to backend accounts
- `POST /api/basiq/sync/[userId]` - Proxy to backend sync

### Components

- **ConnectBank**: Main UI component with Basiq Connect widget
- **useBankConnection**: React hook for managing connection state
- **Header**: Updated to show Connect Bank button
- **Home Page**: Shows connection status and prompts

## Testing

### Test Mode

For development, Basiq provides test bank credentials:
- **Bank**: Test Bank  
- **Username**: `testuser`
- **Password**: `testpass`

### Demo Data Fallback

If no bank is connected, the app automatically uses demo transaction data and shows appropriate messaging to encourage bank connection.

## Security Considerations

- **Read-Only Access**: Basiq only provides read access to account data
- **Bank-Level Encryption**: All data transmission uses bank-level security
- **No Sensitive Storage**: API keys are only stored in server environment
- **Row Level Security**: Database uses RLS to protect user data

## Troubleshooting

### Common Issues

1. **Connection Fails**: Check Basiq API key is correctly encoded and set
2. **No Real Data**: Ensure user has completed bank connection flow
3. **Database Errors**: Verify schema is applied and RLS policies are correct
4. **Widget Not Loading**: Check Basiq Connect script loads properly

### Debug Mode

Enable debug logging:
```bash
# Add to environment
NODE_ENV=development
```

### Support

- Check Basiq documentation: https://api.basiq.io/docs
- Review Supabase docs: https://supabase.com/docs
- Monitor browser console for connection errors

## Next Steps

After setup, users can:
- Connect multiple bank accounts
- View real spending patterns
- Get AI insights based on actual data
- Sync data regularly for updated analysis

The integration provides a complete end-to-end solution for real financial data analysis while maintaining security and user privacy.