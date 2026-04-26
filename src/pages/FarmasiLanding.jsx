import React, { useEffect, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  ShieldCheck, 
  Star,
  InstagramLogo,
  FacebookLogo,
  WhatsappLogo,
  CheckCircle
} from '@phosphor-icons/react';
import { useLenis } from '../hooks/useLenis';
import FarmasiBanner from '../components/FarmasiBanner';
import FarmasiLeadModal from '../components/FarmasiLeadModal';
import { FadeUp } from '../components/CommonUI';

// Memoized Sub-component for better performance
const FeatureCard = memo(({ icon: Icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-white border border-[#634D41]/5 shadow-sm hover:shadow-xl transition-all duration-500 group" style={{ contain: 'layout paint' }}>
    <div className="w-14 h-14 rounded-2xl bg-[#FDF5F2] flex items-center justify-center text-[#634D41] mb-6 group-hover:bg-[#634D41] group-hover:text-white transition-colors duration-500">
      <Icon size={28} weight="duotone" />
    </div>
    <h3 className="text-xl font-black text-[#634D41] mb-3 uppercase tracking-tight">{title}</h3>
    <p className="text-[#634D41]/60 font-medium leading-relaxed">{desc}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

export default function FarmasiLanding() {
  useLenis(); // Centralized Singleton Scroll
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = useCallback(() => setIsModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <div className="min-h-screen bg-[#FDF5F2] font-sans antialiased selection:bg-[#634D41] selection:text-white">

      {/* Main Banner / Hero Section */}
      <FarmasiBanner onOpenModal={handleOpenModal} />

      {/* Why Farmasi Section */}
      <section className="py-32 bg-white" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeUp>
              <p className="text-[#D4A373] font-bold tracking-[0.3em] uppercase text-xs mb-4">¿Por qué elegirnos?</p>
              <h2 className="text-4xl md:text-6xl font-black text-[#634D41] tracking-tighter leading-none mb-6 uppercase">
                EL ESTÁNDAR DE ORO <br /> EN <span className="text-[#D4A373]">CUIDADO PERSONAL</span>
              </h2>
              <p className="text-[#634D41]/60 text-lg font-medium leading-relaxed">
                Combinamos la ciencia europea con ingredientes naturales para ofrecerte resultados reales y una experiencia de lujo en cada aplicación.
              </p>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeUp delay={0.1}>
              <FeatureCard 
                icon={Leaf}
                title="Ingredientes Naturales"
                desc="Fórmulas enriquecidas con extractos botánicos de la más alta pureza, respetando tu piel y el medio ambiente."
              />
            </FadeUp>
            <FadeUp delay={0.2}>
              <FeatureCard 
                icon={ShieldCheck}
                title="Calidad Europea"
                desc="Cumplimos con los más estrictos estándares de la Unión Europea, garantizando seguridad y eficacia total."
              />
            </FadeUp>
            <FadeUp delay={0.3}>
              <FeatureCard 
                icon={CheckCircle}
                title="Resultados Reales"
                desc="Productos diseñados para transformar tu rutina diaria en un ritual de bienestar con cambios visibles."
              />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Testimonial / Social Section */}
      <section className="py-32 bg-[#FDF5F2] overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <FadeUp>
              <div className="flex gap-1 text-[#D4A373] mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} weight="fill" />)}
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-[#634D41] tracking-tighter leading-tight mb-8 uppercase">
                "SINERGIA Y FARMASI HAN CAMBIADO MI <span className="text-[#D4A373]">RUTINA</span> POR COMPLETO"
              </h2>
              <p className="text-[#634D41]/70 text-xl italic font-medium leading-relaxed mb-10">
                "No solo son productos, es el acompañamiento y la comunidad que Sinergia ofrece lo que hace la diferencia. Siento mi piel más sana y mi energía renovada."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#634D41]/10 overflow-hidden">
                  <img src="https://i.pravatar.cc/150?img=32" alt="User" loading="lazy" />
                </div>
                <div>
                  <p className="font-black text-[#634D41] text-sm uppercase">Mariana Valenzuela</p>
                  <p className="text-[#D4A373] text-xs font-bold uppercase tracking-widest">Miembro Sinergia</p>
                </div>
              </div>
            </FadeUp>
          </div>
          
          <div className="lg:w-1/2 relative">
            <FadeUp delay={0.2}>
              <div className="relative z-10 rounded-[3rem] overflow-hidden aspect-square shadow-2xl" style={{ transform: 'translateZ(0)' }}>
                <img 
                  src="https://myfarmasibeauty.eu/wp-content/uploads/2026/02/farmasi-kozmetika-nega-lepota.png" 
                  alt="Farmasi Experience" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4A373]/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#634D41]/5 rounded-full blur-3xl" />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-[#634D41] text-white text-center relative overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <FadeUp>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase">
              ¿LISTA PARA <br /> <span className="text-[#D4A373]">EMPEZAR?</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
              Únete a miles de personas que ya disfrutan de la calidad Farmasi con el respaldo de la comunidad Sinergia.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleOpenModal}
                className="px-12 py-6 bg-[#D4A373] text-white font-black text-sm uppercase tracking-[0.2em] rounded-full hover:bg-[#c49363] transition-all shadow-xl shadow-black/20"
              >
                Registrarme Ahora
              </button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-[#634D41]/5" style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start gap-6">
            <img 
              src="/Logo Blanco.png" 
              alt="Sinergia Logo" 
              className="h-8 w-auto object-contain brightness-0 opacity-80" 
            />
            <p className="text-[#634D41]/40 text-[10px] font-black uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} Sinergia x Farmasi
            </p>
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="w-12 h-12 rounded-full bg-[#634D41]/5 flex items-center justify-center text-[#634D41] hover:bg-[#634D41] hover:text-white transition-all duration-300">
              <InstagramLogo size={20} weight="bold" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-[#634D41]/5 flex items-center justify-center text-[#634D41] hover:bg-[#634D41] hover:text-white transition-all duration-300">
              <FacebookLogo size={20} weight="bold" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-[#634D41]/5 flex items-center justify-center text-[#634D41] hover:bg-[#634D41] hover:text-white transition-all duration-300">
              <WhatsappLogo size={20} weight="bold" />
            </a>
          </div>
        </div>
      </footer>
      <FarmasiLeadModal isOpen={isModalOpen} onClose={handleCloseModal} source="FARMASI" />
    </div>
  );
}
