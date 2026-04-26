import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, EnvelopeSimple, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Sesión iniciada correctamente');
      navigate('/admin');
    } catch (err) {
      toast.error('Email o contraseña incorrecta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans selection:bg-sinergia-gold selection:text-sinergia-black">
      {/* Left Panel: Branding & Welcome */}
      <div className="relative w-full md:w-1/2 bg-sinergia-black flex flex-col justify-between p-8 md:p-16 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sinergia-gold/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sinergia-gold/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <img src="/Logo Blanco.png" alt="Sinergia" className="h-10 w-auto object-contain" />
        </motion.div>

        {/* Text Content */}
        <div className="relative z-10 my-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sinergia-gold font-bold tracking-[0.3em] uppercase text-xs mb-4"
          >
            Sistema de Gestión Comercial
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-6"
          >
            Bienvenido <br />
            <span className="text-white/40">de vuelta.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 text-lg md:text-xl font-medium max-w-sm leading-relaxed"
          >
            Gestiona leads, equipos y métricas desde un solo lugar con total precisión.
          </motion.p>
        </div>

        {/* Footer info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-[10px] text-white font-bold tracking-widest uppercase"
        >
          © {new Date().getFullYear()} Sinergia Centro de Bienestar. Todos los derechos reservados.
        </motion.div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8 md:p-20">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-sinergia-black tracking-tight mb-2">Inicia sesión</h2>
            <p className="text-black/40 text-sm font-medium">Accede a tu cuenta con tu email y contraseña.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sinergia-black/40 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <EnvelopeSimple size={18} className="text-black/30 group-focus-within:text-sinergia-gold transition-colors" />
                </div>
                <input
                  type="email" required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sinergia-black text-sm placeholder:text-black/20 focus:outline-none focus:border-sinergia-gold/50 focus:bg-white focus:ring-4 focus:ring-sinergia-gold/5 transition-all duration-300"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-sinergia-black/40 uppercase tracking-widest ml-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-black/30 group-focus-within:text-sinergia-gold transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"} required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sinergia-black text-sm placeholder:text-black/20 focus:outline-none focus:border-sinergia-gold/50 focus:bg-white focus:ring-4 focus:ring-sinergia-gold/5 transition-all duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-black/30 hover:text-sinergia-black transition-colors"
                >
                  {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4.5 bg-sinergia-black text-white font-black text-sm rounded-2xl shadow-xl shadow-black/10 hover:bg-sinergia-gray disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Ingresar <ArrowRight size={18} weight="bold" /></>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs text-black/40 font-medium">
              ¿No tienes acceso? <span className="text-sinergia-gold font-bold cursor-pointer hover:underline">Solicitar acceso</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
