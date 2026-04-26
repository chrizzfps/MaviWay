import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, EnvelopeSimple, Phone, CaretDown } from '@phosphor-icons/react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const FARMASI_URL = 'https://farmasi.com.co';

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

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

function ModalContent({ onClose, source = 'FARMASI' }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [countryCode, setCountryCode] = useState('+57');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validateName = (name) => {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 && parts.every(part => part.length >= 2);
  };

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
      
      const configDoc = await getDoc(doc(db, 'config', 'general'));
      const redirectUrl = configDoc.exists() && configDoc.data().farmasiUrl ? configDoc.data().farmasiUrl : FARMASI_URL;

      // Check for duplicates
      const leadsRef = collection(db, 'farmasi_leads');
      const q = query(leadsRef, where('email', '==', cleanEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Already exists
        window.open(redirectUrl, '_blank');
        localStorage.setItem('sinergia_farmasi_registered', 'true');
        setIsAlreadyRegistered(true);
        setIsSubmitted(true);
        setLoading(false);
        return;
      }

      // New lead
      await addDoc(leadsRef, {
        ...formData,
        email: cleanEmail,
        phone: fullPhone,
        source: source,
        createdAt: serverTimestamp(),
        status: 'new',
        notes: '',
      });

      toast.success('¡Registro Exitoso!');
      localStorage.setItem('sinergia_farmasi_registered', 'true');
      window.open(redirectUrl, '_blank');
      
      setIsSubmitted(true);
      setLoading(false);

    } catch (err) {
      console.error(err);
      toast.error('Error al enviar.');
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop: White as requested */}
      <motion.div
        className="absolute inset-0 bg-white/95"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      />

      <motion.div
        className="relative bg-white w-[95%] sm:w-full max-w-5xl h-auto md:max-h-[650px] overflow-hidden flex flex-col md:flex-row shadow-2xl rounded-3xl md:rounded-none"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Left Side: Photo (Desktop only) */}
        <div className="hidden md:block w-1/2 relative bg-[#634D41]">
          <img 
            src="https://content.farmasi.com/en-US/Slider/f155e9d2-a8c2-433e-9e94-657c2ef609b0.webp" 
            alt="Farmasi Experience" 
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-[#634D41]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#634D41]/80 via-transparent to-transparent opacity-90" />
          
          <div className="absolute inset-0 p-12 flex flex-col justify-end">
            <img 
              src="/Logo Blanco.png" 
              alt="Sinergia" 
              className="w-24 mb-6 opacity-80 brightness-0 invert" 
              style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(16%) saturate(1021%) hue-rotate(334deg) brightness(91%) contrast(85%)' }}
            />
            <span className="bg-[#D4A373] text-white text-[10px] font-black uppercase tracking-[0.4em] px-4 py-1.5 mb-6 w-fit">
              Exclusivo Sinergia
            </span>
            <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-4">
              UNA CLASE <br />
              <span className="text-[#D4A373]">GRATIS</span> <br />
              TE ESPERA
            </h3>
            <p className="text-white/80 text-xs font-bold leading-relaxed uppercase tracking-widest max-w-[280px]">
              Déjanos tus datos antes de ir a nuestra tienda oficial para recibir tu regalo.
            </p>
          </div>
        </div>

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden bg-[#FDF5F2] p-4 text-center border-b border-[#634D41]/5">
          <img 
            src="/Logo Blanco.png" 
            alt="Sinergia" 
            className="w-20 mx-auto mb-4" 
            style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(16%) saturate(1021%) hue-rotate(334deg) brightness(91%) contrast(85%)' }}
          />
           <span className="bg-[#634D41] text-white text-[9px] font-black uppercase tracking-[0.3em] px-3 py-1 mb-3 inline-block">
             Regalo Exclusivo
           </span>
          <h3 className="text-2xl font-black text-[#634D41] tracking-tighter uppercase leading-[0.9] mb-1">
            UNA CLASE <span className="text-[#D4A373]">GRATIS</span> <br />
            TE ESPERA
          </h3>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 p-5 md:p-12 relative flex flex-col md:justify-center bg-white overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#634D41]/30 hover:text-[#634D41] transition-colors p-2 z-20"
          >
            <X size={20} weight="bold" />
          </button>

          <div className="w-full max-w-sm mx-auto">
            {!isSubmitted ? (
              <>
                <div className="mb-8 hidden md:block">
                  <h2 className="text-2xl font-black text-[#634D41] tracking-tighter uppercase mb-1">Registro</h2>
                  <div className="h-1 w-12 bg-[#D4A373]" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#634D41]/40 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <User size={16} className="text-[#634D41]/30" />
                      </div>
                      <input 
                        type="text" name="name" required 
                        value={formData.name} onChange={handleChange} 
                        className="w-full bg-[#FDF5F2] border border-[#634D41]/10 pl-11 pr-4 py-3 md:py-3.5 text-[#634D41] text-sm focus:outline-none focus:border-[#D4A373] transition-all rounded-none" 
                        placeholder="Juan Pérez" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#634D41]/40 uppercase tracking-widest ml-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <EnvelopeSimple size={16} className="text-[#634D41]/30" />
                      </div>
                      <input 
                        type="email" name="email" required 
                        value={formData.email} onChange={handleChange} 
                        className="w-full bg-[#FDF5F2] border border-[#634D41]/10 pl-11 pr-4 py-3 md:py-3.5 text-[#634D41] text-sm focus:outline-none focus:border-[#D4A373] transition-all rounded-none" 
                        placeholder="juan@ejemplo.com" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#634D41]/40 uppercase tracking-widest ml-1">WhatsApp</label>
                    <div className="flex">
                      <div className="relative group">
                        <select 
                          value={countryCode} 
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="bg-[#FDF5F2] border border-[#634D41]/10 border-r-0 px-2 pl-3 pr-7 py-3 md:py-3.5 text-[#634D41] text-[11px] font-bold focus:outline-none focus:border-[#D4A373] transition-all outline-none rounded-none appearance-none cursor-pointer"
                        >
                          {countryCodes.map(c => (
                            <option key={c.code} value={c.code}>{c.label}</option>
                          ))}
                        </select>
                        <CaretDown size={8} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#634D41]/40 pointer-events-none group-hover:text-[#634D41]" weight="bold" />
                      </div>
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                          <Phone size={16} className="text-[#634D41]/30" />
                        </div>
                        <input 
                          type="tel" name="phone" required 
                          value={formData.phone} onChange={handleChange} 
                          className="w-full bg-[#FDF5F2] border border-[#634D41]/10 pl-11 pr-4 py-3 md:py-3.5 text-[#634D41] text-sm focus:outline-none focus:border-[#D4A373] transition-all rounded-none" 
                          placeholder="300 000 0000" 
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 bg-[#634D41] text-white py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-[#4A3931] transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Obtener mi Regalo'}
                  </button>
                </form>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-4"
              >
                <div className="mb-6">
                   <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-black text-[#634D41] tracking-tighter uppercase mb-2 leading-none">
                    {isAlreadyRegistered ? '¡BIENVENIDO!' : '¡EXITO!'}
                  </h2>
                  <p className="text-[#634D41]/60 text-[11px] font-bold leading-relaxed uppercase tracking-widest">
                    {isAlreadyRegistered 
                      ? 'Ya estás registrado. Tienda abierta en nueva pestaña.' 
                      : '¡Tu regalo está listo! Úsalo en la tienda:'}
                  </p>
                </div>

                <div className="bg-[#FDF5F2] border-2 border-dashed border-[#D4A373] p-8 mb-4">
                  <span className="text-[10px] font-black text-[#D4A373] uppercase tracking-[0.3em] mb-2 block">Cupón de Regalo</span>
                  <div className="text-3xl font-black text-[#634D41] tracking-[0.2em] select-all">
                    FARMASIPROMO
                  </div>
                </div>

                <p className="text-[#634D41]/40 text-[9px] font-black uppercase tracking-widest mb-8">
                  📸 Tómale captura a esto
                </p>

                <button
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-[#634D41]/60 hover:text-[#D4A373] transition-colors"
                >
                  Seguir en Sinergia
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

export default function FarmasiLeadModal({ isOpen, onClose, source }) {
  return (
    <AnimatePresence>
      {isOpen && <ModalContent onClose={onClose} source={source} />}
    </AnimatePresence>
  );
}
