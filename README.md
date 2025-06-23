# onTrack - Personal Financial Assistant

A Next.js-based financial assistant application that provides AI-powered financial advice and insights with secure user authentication.

## 🚀 Latest Update: Supabase Authentication

The application now includes a complete user authentication system powered by Supabase Auth. Users must sign up or log in to access the financial assistant features.

### Authentication Features
- ✅ **User Registration**: Create new accounts with email/password
- ✅ **User Login**: Secure login with existing credentials  
- ✅ **Route Protection**: All main features require authentication
- ✅ **Session Management**: Automatic session handling and persistence
- ✅ **User Interface**: Modern login/signup forms with error handling
- ✅ **Logout Functionality**: Secure logout from sidebar

📖 **For detailed authentication documentation, see:** [frontend/README-AUTH.md](frontend/README-AUTH.md)

## Project Structure

```
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   │   └── auth/        # Authentication page
│   │   ├── components/      # React components
│   │   │   ├── login-form.tsx    # Login form component
│   │   │   └── signup-form.tsx   # Signup form component
│   │   ├── context/         # React context providers
│   │   │   ├── AuthContext.tsx   # Authentication state management
│   │   │   └── FinancialContext.tsx
│   │   ├── services/        # API service layer
│   │   ├── lib/            # Utility libraries
│   │   │   └── supabaseClient.ts # Supabase client configuration
│   │   └── README-AUTH.md   # Authentication documentation
│   └── package.json
├── backend/                 # Express.js backend server
│   ├── api/                # API routes
│   │   └── auth/           # Authentication endpoints
│   ├── db/                 # Database queries & Supabase config
│   ├── gpt/                # AI/LLM integration
│   ├── logic/              # Business logic
│   ├── Utils/              # Utility functions
│   └── server.js           # Main server file
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

### 1. Environment Setup

#### Backend Environment (`.env`)
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_service_role_key

# Other APIs
GROQ_API_KEY=your_groq_api_key
BASIQ_API_KEY=your_basiq_api_key
```

#### Frontend Environment (`.env.local`)
```bash
# Supabase Configuration (Public Keys)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on http://localhost:3000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:3001

### 4. Access the Application
1. Navigate to http://localhost:3001
2. You'll be redirected to the authentication page
3. Create a new account or log in with existing credentials
4. Access the full financial assistant features

## User Flow

### New Users
1. **Registration**: Navigate to auth page → Click "Sign up" → Enter email/password → Create account
2. **Access**: After successful registration, automatically redirected to main app
3. **Features**: Full access to AI financial assistant, chat history, and offers

### Existing Users
1. **Login**: Navigate to auth page → Enter credentials → Sign in
2. **Session**: Automatic session persistence across browser sessions
3. **Logout**: Click logout button in sidebar to securely sign out

## Chat Functionality Fix

### Issue Identified
The chat functionality was not working because:

1. **Port Conflict**: Both frontend and backend were trying to run on port 3000
2. **Missing API Calls**: The main page had TODO comments instead of actual API calls
3. **Incomplete Implementation**: Chat interface was not properly connected to the backend

### Fixes Applied

1. **Port Configuration**:
   - Backend: Port 3000 (unchanged)
   - Frontend: Updated to run on port 3001
   - Updated `frontend/package.json` dev script: `"dev": "next dev -p 3001"`

2. **API Route Fix**:
   - Updated `frontend/src/app/api/prompts/ask/route.ts` to properly forward requests to backend
   - Added better error handling and logging

3. **Main Page Implementation**:
   - Added missing imports: `api` and `useFinancial`
   - Implemented actual API calls in `handleInitialSend` function
   - Fixed prompt button click handlers to make API calls
   - Removed TODO comments and implemented full functionality

4. **Context Integration**:
   - Verified `FinancialContext` is properly set up and used
   - Ensured user data is available for API calls

5. **Authentication Integration**:
   - Updated API calls to use authenticated user's ID
   - Added route protection to main application
   - Integrated user info display in sidebar

## Features

### 🔐 Authentication System
- Secure user registration and login
- Session management with automatic persistence
- Route protection for all main features
- User info display and logout functionality

### 💬 Chat Interface
- AI-powered financial advice
- Real-time conversation
- Chat history persistence
- Responsive design
- User-specific conversations

### 💰 Financial Data Integration
- Basiq API integration for real transaction data
- Fallback data when API is unavailable
- Transaction categorization and analysis
- User-specific financial insights

### 🎨 User Interface
- Modern, clean design with authentication
- Collapsible sidebar with user info
- Pre-prepared financial prompts
- Offer recommendations
- Responsive mobile-friendly design

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### Frontend API Routes (Next.js)
- `POST /api/prompts/ask` - Forwards requests to backend

### Backend API Routes (Express)
- `POST /api/prompts/ask` - Main AI chat endpoint
- `GET /api/basiq/user/:userId` - User data
- `GET /api/basiq/user/:userId/accounts` - User accounts
- `GET /api/basiq/user/:userId/transactions` - User transactions

## Technical Stack

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase Auth (client-side)
- Axios for API calls

### Backend
- Express.js
- Node.js
- Supabase (server-side)
- Groq LLM integration
- Basiq financial data API
- CORS enabled

### Authentication
- Supabase Auth for user management
- JWT sessions with automatic refresh
- Client and server-side auth validation
- Secure password handling

## Development Notes

- The application uses authenticated user IDs for personalized experiences
- CORS is configured to allow all origins in development
- Error handling includes fallback responses when APIs fail
- Chat history is stored in localStorage for persistence
- All sensitive routes require authentication
- Environment variables separate public and private keys

## Troubleshooting

### Authentication Issues
1. **Can't access main app**: Ensure you're logged in at `/auth`
2. **Login/Signup errors**: Check Supabase project configuration
3. **Environment variables**: Verify all Supabase credentials are set correctly
4. **Session issues**: Clear browser storage and re-login

### Chat Not Working
1. Ensure both servers are running on correct ports
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Check environment variables are set
5. Ensure user is authenticated

### Port Conflicts
- Backend: 3000
- Frontend: 3001
- Update package.json if ports need to be changed

### API Errors
- Check backend logs for detailed error messages
- Verify API keys are set correctly
- Ensure network connectivity to external APIs
- Confirm user authentication status

## Security Notes

- All API keys should be kept secure and not committed to version control
- Supabase handles secure password hashing automatically
- Sessions are managed securely by Supabase Auth
- Route protection prevents unauthorized access
- User data is isolated per authenticated user

## Environment Variables

- **Never commit `.env` or any environment variable files to version control.**
- Add your secrets to a `.env` file locally, which is already gitignored.
- If you need to share required variables, use a `.env.example` file with placeholder values.
