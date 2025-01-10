import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MemberPage } from './pages/MemberPage/MemberPage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/members" />} />
        <Route path="/members" element={<MemberPage />} />
      </Routes>
    </Router>
  );
};

export default App;
