import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Spending from './pages/Spending';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/spending" element={<Spending />} />
      </Routes>
    </Router>
  );
}

export default App;
