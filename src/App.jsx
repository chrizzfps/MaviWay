import React, { useState, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useLenis } from './hooks/useLenis';

// Optimized Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import SinergiaLeadModal from './components/SinergiaLeadModal';

// Pages
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const FarmasiLanding = React.lazy(() => import('./pages/FarmasiLanding'));

const LoadingScreen = () => <div className="h-screen bg-[#0A0A0A]" />;

// ─── Sinergia Landing View ─────────────────────────────────────────────────────

function SinergiaLanding() {
  const lenis = useLenis(); // Get the instance directly from the hook
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync Lenis with Modal State using the instance reference
  useEffect(() => {
    if (!lenis) return;
    
    if (isModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isModalOpen, lenis]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans antialiased selection:bg-sinergia-gold selection:text-sinergia-black">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      <Hero isModalOpen={isModalOpen} onOpenModal={() => setIsModalOpen(true)} />
      <Footer />
      <SinergiaLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source="HOME"
      />
    </div>
  );
}

// ─── Root App ──────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<SinergiaLanding />} />
          <Route path="/farmasi" element={<FarmasiLanding />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}