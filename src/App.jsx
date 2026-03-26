import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CrisisBar from './components/CrisisBar';
import HomePage from './pages/HomePage';
import CrisisPage from './pages/CrisisPage';
import ResourcesPage from './pages/ResourcesPage';
import SafetyPlanPage from './pages/SafetyPlanPage';
import RightsPage from './pages/RightsPage';
import ChatPage from './pages/ChatPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/crisis" element={<CrisisPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/safety-plan" element={<SafetyPlanPage />} />
            <Route path="/rights" element={<RightsPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </main>
        <Footer />
        <CrisisBar />
      </div>
    </Router>
  );
}

export default App;
