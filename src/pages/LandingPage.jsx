import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LeadModal from '../components/LeadModal';

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-mavi-gray flex flex-col-reverse md:flex-row font-sans">
      {/* Left Column (Bottom on Mobile): Balance Scale */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative overflow-hidden bg-white flex flex-col justify-between">
        {/* Abstract Background for the left side (using the image) */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url('/images/Gemini_Generated_Image_c1t477c1t477c1t4.png')` }}
        />
        
        {/* Logo Area */}
        <div className="relative z-10 p-8 md:p-12">
           <img 
            src="/images/Logo Blanco.png" 
            alt="MaviWay Logo" 
            className="h-10 md:h-14 w-auto drop-shadow-lg filter invert-[1] brightness-0" 
            /* Note: Inverting since the logo is white and might need to show on a lighter part of the BG, 
               or adjusting based on exact logo color. The original design has a white logo on dark area. */
            style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }}
          />
        </div>

        {/* Footer Area Left */}
        <div className="relative z-10 p-8 md:p-12 text-white font-bold tracking-widest text-sm drop-shadow-md">
          MAVIWAY.COM
        </div>
      </div>

      {/* Right Column: Woman & CTA */}
      <div className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative flex items-center justify-center p-8 md:p-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: `url('/images/Gemini_Generated_Image_wcuddgwcuddgwcud.png')` }}
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-white/10 z-10 md:bg-gradient-to-l md:from-white/0 md:via-white/60 md:to-white/90" />
        <div className="absolute inset-b-0 h-1/2 w-full bg-gradient-to-t from-white to-transparent z-10 md:h-full md:inset-l-0 md:w-full md:bg-gradient-to-t md:from-white/90 md:to-transparent" />

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 max-w-lg text-center md:text-center mt-auto md:mt-0 flex flex-col items-center pb-8 md:pb-0"
        >
          <h1 className="font-accentBold text-3xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-[1.1] tracking-tight drop-shadow-sm uppercase">
            Ready to tip the scales <br/>in your favor?
          </h1>

          <p className="text-gray-800 text-lg md:text-xl font-light mb-10 leading-relaxed font-accentLight">
            Discover simple, proven ways to lower your cost of living and make your retirement income go further with MaviWay.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(30, 58, 138, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-300 ease-in-out bg-mavi-blue border border-transparent rounded-full shadow-xl overflow-hidden"
          >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></div>
            <span className="relative z-10">Show Me How with MaviWay</span>
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
