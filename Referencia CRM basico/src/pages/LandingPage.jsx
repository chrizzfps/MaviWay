import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LeadModal from '../components/LeadModal';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Preload hints for background images */}
      <link rel="preload" as="image" href="/images/Gemini_Generated_Image_wcuddgwcuddgwcud.png" />
      <link rel="preload" as="image" href="/images/Gemini_Generated_Image_c1t477c1t477c1t4.png" />

      <div className="min-h-screen bg-mavi-gray flex flex-col-reverse md:flex-row font-sans">

        {/* ── Left Column (Bottom on Mobile): Balance Scale ── */}
        <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative overflow-hidden bg-white flex flex-col justify-between">
          {/* Background image — promoted to its own composite layer */}
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url('/images/Gemini_Generated_Image_c1t477c1t477c1t4.png')`,
              willChange: 'transform', // own GPU layer, so it doesn't repaint siblings
            }}
          />

          {/* Logo */}
          <div className="relative z-10 p-8 md:p-12">
            <img
              src="/images/Logo Blanco.png"
              alt="MaviWay Logo"
              className="h-10 md:h-14 w-auto"
              style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }}
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Footer */}
          <div className="relative z-10 p-8 md:p-12 text-white font-bold tracking-widest text-sm drop-shadow-md">
            MAVIWAY.COM
          </div>
        </div>

        {/* ── Right Column: Woman & CTA ── */}
        <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative flex items-center justify-center p-8 md:p-16">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage: `url('/images/Gemini_Generated_Image_wcuddgwcuddgwcud.png')`,
              willChange: 'transform',
            }}
          />

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-white/10 z-10 md:bg-gradient-to-l md:from-white/0 md:via-white/60 md:to-white/90" />
          <div className="absolute inset-b-0 h-1/2 w-full bg-gradient-to-t from-white to-transparent z-10 md:h-full md:inset-l-0 md:w-full md:bg-gradient-to-t md:from-white/90 md:to-transparent" />

          {/* Content — simple fade-in, no scale transform (avoids layout thrash) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative z-20 max-w-lg text-center md:text-center mt-auto md:mt-0 flex flex-col items-center pb-8 md:pb-0"
            style={{ willChange: 'opacity, transform' }}
          >
            <h1 className="font-accentBold text-3xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-[1.1] tracking-tight drop-shadow-sm uppercase">
              Ready to tip the scales <br /> in your favor?
            </h1>

            <p className="text-gray-800 text-lg md:text-xl font-light mb-10 leading-relaxed font-accentLight">
              Discover simple, proven ways to lower your cost of living and make your retirement income go further with MaviWay.
            </p>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsModalOpen(true)}
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-mavi-blue border border-transparent rounded-full shadow-xl overflow-hidden transition-shadow duration-300 hover:shadow-[0px_10px_30px_rgba(30,58,138,0.4)]"
              style={{ willChange: 'transform' }}
            >
              {/* Hover gradient — CSS only, no JS animation */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Show Me How with MaviWay</span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Modal rendered via Portal — fully outside the landing layout tree */}
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
