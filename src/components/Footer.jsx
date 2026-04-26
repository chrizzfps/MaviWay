import React, { memo } from 'react';
import { MapPin, InstagramLogo, FacebookLogo, TwitterLogo, LinkedinLogo } from '@phosphor-icons/react';

const Footer = memo(() => {
  return (
    <footer 
      className="bg-sinergia-black text-white pt-32 pb-12 border-t border-white/5" 
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-2">
          <img src="/Logo Blanco.png" alt="Sinergia Logo" className="h-12 w-auto object-contain mb-6" />
          <p className="text-white/40 max-w-xs leading-relaxed mb-6 text-sm">
            Centro de bienestar, salud y belleza dedicado a impulsar lo mejor de ti.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-sm mb-8">
            <MapPin size={16} weight="fill" className="text-sinergia-gold shrink-0" />
            Sede Norte de Bogotá, Colombia
          </div>
          <div className="flex gap-3">
            {[InstagramLogo, FacebookLogo, TwitterLogo, LinkedinLogo].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-sinergia-gold hover:text-sinergia-black hover:border-transparent transition-all duration-300"
              >
                <Icon size={16} weight="regular" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-widest uppercase text-white/50 mb-6">Experiencias</h4>
          <ul className="space-y-3 text-sm text-white/40">
            {['Coworking', 'Academia de Baile', 'Crecimiento Personal', 'Salud y Belleza', 'Cafetería'].map(l => (
              <li key={l}><a href="#" className="hover:text-sinergia-gold transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-widest uppercase text-white/50 mb-6">Compañía</h4>
          <ul className="space-y-3 text-sm text-white/40">
            {['Nuestra Historia', 'Para Empresas (B2B)', 'Contacto', 'Términos', 'Privacidad'].map(l => (
              <li key={l}><a href="#" className="hover:text-sinergia-gold transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/5 text-xs text-white/20 font-bold">
        <p>© {new Date().getFullYear()} SINERGIA CENTRO DE BIENESTAR. TODOS LOS DERECHOS RESERVADOS.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">TÉRMINOS</a>
          <a href="#" className="hover:text-white transition-colors">PRIVACIDAD</a>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
