import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

export default function LeadModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save Lead to Firestore
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp(),
        status: 'new',
        notes: ''
      });

      // 2. Fetch Redirect URL
      const configDoc = await getDoc(doc(db, 'config', 'general'));
      let redirectUrl = 'https://maviway.com'; // Default fallback
      
      if (configDoc.exists() && configDoc.data().redirectUrl) {
        redirectUrl = configDoc.data().redirectUrl;
      }

      toast.success('Información enviada con éxito!');
      // 3. Redirect User
      window.location.href = redirectUrl;

    } catch (err) {
      console.error("Error saving lead:", err);
      // Even if redirect fetch fails, we don't want to trap the user
      // But if save fails, we show error.
      toast.error('Ocurrió un error. Por favor intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-accentBold text-gray-900 mb-2">Get Started Today</h2>
          <p className="text-gray-500 font-sans mb-8">Enter your details below to discover how MaviWay can help you tip the scales.</p>

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div className="relative">
              <label className="sr-only" htmlFor="name">Full Name</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mavi-blue focus:border-mavi-blue transition-colors sm:text-sm bg-gray-50 hover:bg-white"
                placeholder="Full Name"
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="email">Email Address</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mavi-blue focus:border-mavi-blue transition-colors sm:text-sm bg-gray-50 hover:bg-white"
                placeholder="Email Address"
              />
            </div>

            <div className="relative">
              <label className="sr-only" htmlFor="phone">Phone Number</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mavi-blue focus:border-mavi-blue transition-colors sm:text-sm bg-gray-50 hover:bg-white"
                placeholder="Phone Number"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-md text-lg font-bold text-white bg-mavi-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mavi-blue transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">We respect your privacy and will never share your information.</p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
