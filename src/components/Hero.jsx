import React, { memo, useRef, useEffect } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { GoldButton } from './CommonUI';

/**
 * Hardened Hero with Background Control
 * Pauses video when modal is open to free up GPU resources.
 */
const Hero = memo(({ isModalOpen, onOpenModal }) => {
  const videoRef = useRef(null);

  // Stop video playback when modal is open to eliminate GPU overdraw
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isModalOpen) {
      videoRef.current.pause();
    } else {
      // Re-play with catch for browsers that block auto-play after pause
      videoRef.current.play().catch(e => console.debug("Video play blocked or interrupted"));
    }
  }, [isModalOpen]);

  return (
    <section 
      className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] flex items-center justify-center"
      style={{ contain: 'layout paint' }}
    >
      {/* Video Layer - Isolated in its own GPU composition layer */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ transform: 'translate3d(0,0,0)' }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero_poster.jpg"
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/hero_bg.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-transparent to-[#0A0A0A] z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-5xl mx-auto hero-content-entry">
        <h1 className="text-4xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-6">
          Transforma tu vida,
          <span className="block sm:inline"> </span>
          <span className="bg-gradient-to-r from-sinergia-gold to-sinergia-goldlight bg-clip-text text-transparent">
            encuentra tu equilibrio.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Impulsando lo mejor de cada persona para transformar su vida hacia el bienestar emocional, mental y físico.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GoldButton onClick={onOpenModal}>
            Comenzar <ArrowRight size={18} />
          </GoldButton>
        </div>
      </div>

      <style>{`
        @keyframes heroEntry {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hero-content-entry {
          animation: heroEntry 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        
        .scroll-indicator {
          animation: scrollDot 2s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 scroll-indicator">
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-1.5 bg-sinergia-gold rounded-full" />
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
