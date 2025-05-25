import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Overview from './pages/overview';
import Budget from './pages/budget';
import ChatPage from './pages/chat';
import { FinancialProvider } from './context/FinancialContext';

function App() {
  return (
    <FinancialProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </FinancialProvider>
  );
}

export default App;