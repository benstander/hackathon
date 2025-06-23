# onTrack - Personal Financial Assistant

A Next.js-based financial assistant application that provides AI-powered financial advice and insights.

## Project Structure

```
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service layer
│   │   └── lib/            # Utility libraries
│   └── package.json
├── backend/                 # Express.js backend server
│   ├── api/                # API routes
│   ├── db/                 # Database queries
│   ├── gpt/                # AI/LLM integration
│   ├── logic/              # Business logic
│   ├── Utils/              # Utility functions
│   └── server.js           # Main server file
└── README.md
```

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

## Running the Application

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm start
```
Backend will run on http://localhost:3000

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:3001

### Environment Variables
Make sure to set up the following environment variables in the backend:
- `GROQ_API_KEY` - For AI responses
- `BASIQ_API_KEY` - For financial data integration

## Features

### Chat Interface
- AI-powered financial advice
- Real-time conversation
- Chat history persistence
- Responsive design

### Financial Data Integration
- Basiq API integration for real transaction data
- Fallback data when API is unavailable
- Transaction categorization and analysis

### User Interface
- Modern, clean design
- Collapsible sidebar with chat history
- Pre-prepared financial prompts
- Offer recommendations

## API Endpoints

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
- Axios for API calls

### Backend
- Express.js
- Node.js
- Groq LLM integration
- Basiq financial data API
- CORS enabled

## Development Notes

- The application uses a mock user ID (`fb919047-167b-4b33-9cfc-ab963c780166`) for development
- CORS is configured to allow all origins in development
- Error handling includes fallback responses when APIs fail
- Chat history is stored in localStorage for persistence

## Troubleshooting

### Chat Not Working
1. Ensure both servers are running on correct ports
2. Check browser console for errors
3. Verify API endpoints are accessible
4. Check environment variables are set

### Port Conflicts
- Backend: 3000
- Frontend: 3001
- Update package.json if ports need to be changed

### API Errors
- Check backend logs for detailed error messages
- Verify API keys are set correctly
- Ensure network connectivity to external APIs
