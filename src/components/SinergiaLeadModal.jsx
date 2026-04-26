import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, CircleNotch, User, EnvelopeSimple, Phone, CaretDown } from '@phosphor-icons/react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';

const countryCodes = [
  { code: '+57', label: 'CO +57', flag: '🇨🇴' },
  { code: '+58', label: 'VE +58', flag: '🇻🇪' },
  { code: '+52', label: 'MX +52', flag: '🇲🇽' },
  { code: '+34', label: 'ES +34', flag: '🇪🇸' },
  { code: '+1', label: 'US/CA +1', flag: '🇺🇸' },
  { code: '+593', label: 'EC +593', flag: '🇪🇨' },
  { code: '+51', label: 'PE +51', flag: '🇵🇪' },
  { code: '+56', label: 'CL +56', flag: '🇨🇱' },
  { code: '+54', label: 'AR +54', flag: '🇦🇷' },
];

// 1. Memoized Input Component to prevent re-renders of the whole form on focus
const FormInput = memo(({ label, icon: Icon, ...props }) => (
  <div className="space-y-1.5" style={{ contain: 'content' }}>
    <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
        <Icon size={18} className="text-white/20" />
      </div>
      <input 
        {...props}
        className="w-full bg-white/[0.03] border border-white/10 rounded-none pl-14 pr-6 py-5 text-xs text-white placeholder:text-white/20 focus:border-sinergia-gold/50 focus:bg-white/[0.06] outline-none transition-all font-bold uppercase tracking-widest"
        style={{ transform: 'translateZ(0)' }} // Forces GPU acceleration for the input box
      />
    </div>
  </div>
));

const SinergiaLeadModal = ({ isOpen, onClose, source = "HOME" }) => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [countryCode, setCountryCode] = useState('+57');

  const validateName = (name) => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 && parts.every(part => part.length >= 2);
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(formData.name)) {
      toast.error('Por favor ingresa tu nombre y apellido completo.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = formData.email.trim().toLowerCase();
      const fullPhone = `${countryCode} ${formData.phone.trim()}`;

      const leadsRef = collection(db, 'farmasi_leads');
      const q = query(leadsRef, where('email', '==', cleanEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setSubmitted(true);
        toast.success('¡Bienvenido de nuevo!');
        setTimeout(() => onClose(), 3000);
        return;
      }

      await addDoc(leadsRef, {
        ...formData,
        email: cleanEmail,
        phone: fullPhone,
        source: source.toUpperCase(),
        status: 'new',
        createdAt: serverTimestamp(),
        notes: '',
      });

      setSubmitted(true);
      toast.success('¡Registro exitoso!');
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({ name: '', email: '', phone: '' });
      }, 4000);
    } catch (err) {
      console.error(err);
      toast.error('Error al enviar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ isolation: 'isolate' }}>
          {/* Static Blur Overlay - Optimized to not re-render with form state */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90"
            style={{ title: 'Overlay solid background' }}
          />

          <motion.div
            className="relative bg-[#0A0A0A] w-full max-w-4xl h-auto flex flex-col md:flex-row border border-white/10 overflow-hidden rounded-none shadow-2xl"
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ 
              willChange: 'transform, opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Left Panel */}
            <div className="w-full md:w-[45%] bg-white/[0.02] p-10 md:p-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
              <div style={{ contain: 'layout' }}>
                <img src="/Logo Blanco.png" alt="Sinergia" className="h-9 w-auto mb-16 opacity-90" />
                <h2 className="text-4xl md:text-5xl font-black text-white leading-[1] tracking-tighter uppercase mb-8">
                  TU BIENESTAR <br />
                  <span className="text-sinergia-gold">COMIENZA AQUÍ</span>
                </h2>
                <p className="text-white/40 text-sm font-medium leading-relaxed max-w-xs">
                  Únete a la comunidad de transformación más exclusiva y comienza tu camino hoy mismo.
                </p>
              </div>
              <div className="hidden md:block">
                <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em]">
                  © 2024 Sinergia Community
                </p>
              </div>
            </div>

            {/* Right Panel: Form Area */}
            <div className="flex-1 p-8 md:p-14 relative flex flex-col justify-center bg-[#0A0A0A]">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-white/20 hover:text-white transition-colors z-10"
              >
                <X size={24} weight="bold" />
              </button>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="mb-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-sinergia-gold">
                      Registro de Miembro
                    </label>
                  </div>

                  <div className="space-y-5">
                    <FormInput 
                      name="name"
                      label="Nombre y Apellido"
                      icon={User}
                      placeholder="JUAN PÉREZ"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />

                    <FormInput 
                      name="email"
                      label="Correo Electrónico"
                      icon={EnvelopeSimple}
                      type="email"
                      placeholder="JUAN@EJEMPLO.COM"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />

                    <div className="space-y-1.5" style={{ contain: 'content' }}>
                      <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">WhatsApp / Celular</label>
                      <div className="flex">
                        <div className="relative group">
                          <select 
                            value={countryCode} 
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="bg-white/[0.05] border border-white/10 border-r-0 px-4 pr-10 py-5 text-white text-[11px] font-bold focus:outline-none focus:border-sinergia-gold/50 transition-all outline-none rounded-none appearance-none cursor-pointer h-full"
                            style={{ transform: 'translateZ(0)' }}
                          >
                            {countryCodes.map(c => (
                              <option key={c.code} value={c.code} className="bg-[#0A0A0A]">{c.label}</option>
                            ))}
                          </select>
                          <CaretDown size={10} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none group-hover:text-sinergia-gold transition-colors" weight="bold" />
                        </div>
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <Phone size={18} className="text-white/20" />
                          </div>
                          <input 
                            name="phone"
                            type="tel" required
                            placeholder="300 000 0000"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-none pl-14 pr-6 py-5 text-xs text-white placeholder:text-white/20 focus:border-sinergia-gold/50 focus:bg-white/[0.06] outline-none transition-all font-bold uppercase tracking-widest"
                            style={{ transform: 'translateZ(0)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full mt-8 py-6 bg-sinergia-gold hover:bg-sinergia-goldlight disabled:opacity-50 text-sinergia-black font-black text-[11px] uppercase tracking-[0.4em] transition-all duration-300 flex items-center justify-center gap-3 rounded-none shadow-xl"
                    style={{ transform: 'translateZ(0)' }}
                  >
                    {loading ? (
                      <CircleNotch size={20} className="animate-spin" weight="bold" />
                    ) : (
                      "Confirmar Registro"
                    )}
                  </button>
                  
                  <p className="text-[9px] text-white/20 text-center font-bold uppercase tracking-[0.2em] mt-8 leading-relaxed">
                    Tus datos están protegidos por nuestra <br /> política de privacidad y seguridad.
                  </p>
                </form>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-20 h-20 bg-sinergia-gold/10 rounded-none flex items-center justify-center mb-8 border border-sinergia-gold/20">
                    <CheckCircle size={40} className="text-sinergia-gold" weight="fill" />
                  </div>
                  <h3 className="text-3xl font-black text-white tracking-tighter mb-4 uppercase">¡RECIBIDO!</h3>
                  <p className="text-white/40 text-sm font-medium max-w-[280px] leading-relaxed">
                    Hemos recibido tu información. Muy pronto un guía se pondrá en contacto contigo.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SinergiaLeadModal;
