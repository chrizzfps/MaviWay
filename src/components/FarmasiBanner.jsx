import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, CaretDown } from '@phosphor-icons/react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import FarmasiLeadModal from '../components/FarmasiLeadModal';

const DEFAULT_FARMASI_URL = 'https://comunidad.farmasi.co/Sinergia';

const FarmasiBanner = memo(({ onOpenModal: propOnOpenModal }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(DEFAULT_FARMASI_URL);

  useEffect(() => {
    // Check local storage
    const registered = localStorage.getItem('sinergia_farmasi_registered');
    if (registered === 'true') {
      setIsRegistered(true);
    }

    // Fetch URL from config
    const fetchConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'config', 'general'));
        if (configDoc.exists() && configDoc.data().farmasiUrl) {
          setRedirectUrl(configDoc.data().farmasiUrl);
        }
      } catch (err) {
        console.error("Error fetching config:", err);
      }
    };
    fetchConfig();
  }, []);

  const handleButtonClick = () => {
    if (isRegistered) {
      window.open(redirectUrl, '_blank');
    } else {
      if (propOnOpenModal) {
        propOnOpenModal();
      } else {
        setIsModalOpen(true);
      }
    }
  };

  return (
    <>
      <section className="relative h-[100dvh] md:h-[900px] overflow-hidden flex items-center bg-[#FDF5F2] group" style={{ contain: 'layout paint' }}>
        {/* Background Image - Optimized with Hardware Acceleration */}
        <div className="absolute top-0 right-0 w-full h-full md:w-[55%] lg:w-1/2 overflow-hidden select-none pointer-events-none" style={{ transform: 'translateZ(0)' }}>
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="https://myfarmasibeauty.eu/wp-content/uploads/2026/02/farmasi-kozmetika-nega-lepota.png" 
            alt="Farmasi Wellness Products" 
            className="w-full h-full object-cover hidden md:block"
          />
          {/* Mobile Background */}
          <div className="md:hidden absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#FDF5F2] to-transparent z-[1]" />
          <motion.img 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 0.3 }}
            src="https://myfarmasibeauty.eu/wp-content/uploads/2026/02/farmasi-kozmetika-nega-lepota.png" 
            className="w-full h-1/2 object-contain object-bottom absolute bottom-0 md:hidden grayscale opacity-20"
          />
          
          <div className="hidden md:block absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#FDF5F2] via-[#FDF5F2]/50 to-transparent" />
        </div>

        {/* Overlay for mobile readability */}
        <div className="absolute inset-0 bg-[#FDF5F2]/40 md:hidden" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20 flex flex-col justify-center" style={{ transform: 'translateZ(0)' }}>
          <div className="max-w-2xl relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-col gap-6 mb-10">
                <motion.img 
                  src="/Logo Blanco.png" 
                  alt="Sinergia Logo" 
                  className="h-8 w-auto object-contain self-start opacity-80"
                  style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(11%) saturate(1065%) hue-rotate(338deg) brightness(93%) contrast(85%)' }}
                />
                <div className="flex items-center gap-3">
                   <span className="bg-[#634D41] text-white text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1">
                     Exclusivo Sinergia
                   </span>
                   <div className="h-px w-12 bg-[#634D41]/20" />
                </div>
              </div>

              <h2 className="text-5xl md:text-8xl font-black text-[#634D41] tracking-tighter leading-[0.85] mb-8 uppercase">
                TU TIENDA DE <br />
                <span className="text-[#D4A373]">BIENESTAR</span> <br />
                FAVORITA
              </h2>
              
              <p className="text-[#634D41]/80 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-lg">
                La experiencia Sinergia se une a la calidad global de Farmasi. Explora nuestra tienda oficial y lleva el cuidado premium a tu hogar hoy mismo.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleButtonClick}
                className="group flex items-center gap-4 px-12 py-6 bg-[#634D41] text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(99,77,65,0.25)] hover:bg-[#4A3931] transition-all duration-300"
              >
                {isRegistered ? (
                  <>
                    <ArrowRight size={20} weight="bold" className="group-hover:translate-x-2 transition-transform" />
                    Ir a la Tienda Oficial
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} weight="bold" className="group-hover:animate-bounce" />
                    Obtener mi Regalo
                  </>
                )}
              </motion.button>
              
              <p className="mt-8 text-[10px] text-[#634D41]/40 font-bold uppercase tracking-widest italic">
                * Productos dermatológicamente testeados y libres de crueldad animal.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Skip Button */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          whileHover={{ opacity: 0.8 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-[0.4em] text-[#634D41] z-20 group transition-all"
        >
          <span className="hidden md:inline">Explorar beneficios</span>
          <CaretDown size={16} className="group-hover:translate-y-1 transition-transform" weight="bold" />
        </motion.button>
      </section>

      {!propOnOpenModal && <FarmasiLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="FARMASI" />}
    </>
  );
});

FarmasiBanner.displayName = 'FarmasiBanner';

export default FarmasiBanner;
