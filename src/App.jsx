import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle,
  Envelope,
  MapPin,
  Users,
  User,
  Heart,
  Coffee,
  WhatsappLogo,
  Sparkle,
  Star,
  Briefcase,
  Play,
  List,
  XCircle,
  InstagramLogo,
  FacebookLogo,
  TwitterLogo,
  FlowerLotus,
  HandHeart
} from '@phosphor-icons/react';

// ─── Primitives ───────────────────────────────────────────────────────────────

const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const GoldButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className={`inline-flex items-center gap-2 bg-sinergia-gold text-sinergia-black font-bold px-8 py-4 rounded-full transition-colors hover:bg-sinergia-goldlight shadow-lg shadow-sinergia-gold/20 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

const GhostButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className={`inline-flex items-center gap-2 border border-white/30 text-white font-bold px-8 py-4 rounded-full backdrop-blur-sm hover:bg-white/10 transition-colors ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Experiencias', href: '#experiencias' },
    { label: 'Empresas', href: '#empresas' },
    { label: 'Comunidad', href: '#comunidad' },
  ];

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-sinergia-black/95 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        <a href="#" className="select-none">
          <img src="/Logo Blanco.png" alt="Sinergia Logo" className="h-10 w-auto object-contain" />
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-white/70 hover:text-sinergia-gold transition-colors duration-200">
              {l.label}
            </a>
          ))}
          <GoldButton className="text-sm px-6 py-2.5">Únete a la familia</GoldButton>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <XCircle size={28} /> : <List size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-sinergia-black border-t border-white/10 overflow-hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-lg font-bold text-white/80 hover:text-sinergia-gold">
                  {l.label}
                </a>
              ))}
              <GoldButton className="w-full justify-center">Únete a la familia</GoldButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 220]);
  const fadeOut = useTransform(scrollY, [0, 500], [1, 0]);

  // Real pilates/yoga class on YouTube (4K, aesthetic)
  const YT_ID = 'v35WEglBOFM';

  return (
    <section className="relative h-screen w-full overflow-hidden bg-sinergia-black flex items-center justify-center">
      {/* Parallax video layer */}
      <motion.div style={{ y }} className="absolute inset-0 scale-[1.35] pointer-events-none">
        <iframe
          className="absolute w-full h-full"
          src={`https://www.youtube.com/embed/${YT_ID}?autoplay=1&mute=1&loop=1&controls=0&playlist=${YT_ID}&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&start=5`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          title="Sinergia background"
        />
      </motion.div>

      {/* Gradients overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/55 to-sinergia-black z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10" />

      {/* Content */}
      <motion.div style={{ opacity: fadeOut }} className="relative z-20 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 text-white/80 text-xs font-bold tracking-widest uppercase px-5 py-2 rounded-full mb-8"
        >
          <HandHeart size={14} className="text-sinergia-gold" />
          Centro de Bienestar Integral
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-6"
        >
          Transforma tu vida,
          <br />
          <span className="bg-gradient-to-r from-sinergia-gold to-sinergia-goldlight bg-clip-text text-transparent">
            encuentra tu equilibrio.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-lg md:text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Impulsando lo mejor de cada persona para transformar su vida hacia el bienestar emocional, mental y físico[cite: 11]. Un ambiente lleno de tranquilidad, alegría, esperanza y fe[cite: 11].
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <GoldButton>
            Empieza tu transformación <ArrowRight size={18} />
          </GoldButton>
          <GhostButton>
            <Play size={16} /> Explora los espacios
          </GhostButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-sinergia-gold rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

// ─── Social Proof ─────────────────────────────────────────────────────────────

const SocialProof = () => {
  const items = ['Farmasi', 'Mario Camejo Consultores', 'Lo Mejor de Ti',];
  return (
    <div className="bg-sinergia-black border-y border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-white/30 text-xs font-bold tracking-[0.25em] uppercase mb-8">
          Empresas e individuos que confían en Sinergia
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {items.map((name, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              className="text-white/20 font-black tracking-tighter text-lg hover:text-sinergia-gold/60 transition-colors duration-300 cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Experiencias (Bento) ─────────────────────────────────────────────────────

const cards = [
  {
    title: 'Coworking',
    desc: 'Espacios modernos para potenciar tu productividad y creatividad.',
    Icon: Briefcase,
    span: 'md:col-span-2 md:row-span-1',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Academia de Baile',
    desc: 'Ritmos latinos, Zumba y coreografías que liberan tu energía.',
    Icon: Users,
    span: 'md:col-span-1 md:row-span-1',
    img: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Pilates',
    desc: 'Conecta tu cuerpo y mente con movimientos controlados y precisos.',
    Icon: FlowerLotus,
    span: 'md:col-span-1 md:row-span-2',
    img: 'https://images.unsplash.com/photo-1747238415033-b74eec07eb59?q=80&w=1311&auto=format&fit=crop&w=1080&q=80',
    isNew: true,
  },
  {
    title: 'Crecimiento Personal',
    desc: 'Cursos y talleres para transformar tu inteligencia emocional.',
    Icon: Star,
    span: 'md:col-span-1 md:row-span-1',
    img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Salud y Belleza',
    desc: 'Cuidado integral: mente, cuerpo y espíritu en armonía.',
    Icon: Heart,
    span: 'md:col-span-1 md:row-span-1',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1080&q=80',
  },
  {
    title: 'Cafetería',
    desc: 'El punto de encuentro perfecto para pausas saludables.',
    Icon: Coffee,
    span: 'md:col-span-2 md:row-span-1',
    img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1080&q=80',
  },
];

const Experiencias = () => (
  <section id="experiencias" className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <FadeUp>
        <p className="text-sinergia-gold font-bold tracking-widest uppercase text-sm mb-4">Lo que ofrecemos</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-sinergia-black leading-none mb-5">
          6 Experiencias.
          <br />
          <span className="text-sinergia-gold">Un solo propósito.</span>
        </h2>
        <p className="text-xl text-black/50 font-medium max-w-2xl leading-relaxed mb-16">
          Diseñamos ecosistemas de bienestar que impulsan lo mejor de cada persona.
        </p>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[320px] grid-flow-dense">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6 }}
            className={`relative rounded-3xl overflow-hidden group cursor-pointer shadow-xl shadow-black/10 border border-black/5 ${card.span}`}
          >
            <img
              src={card.img}
              alt={card.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            
            {card.isNew && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="absolute top-6 right-6 z-20"
              >
                <div className="relative group/badge">
                  <div className="absolute -inset-1 bg-gradient-to-r from-sinergia-gold to-sinergia-goldlight rounded-full blur opacity-75 group-hover/badge:opacity-100 transition duration-1000 group-hover/badge:duration-200 animate-pulse" />
                  <div className="relative px-4 py-1.5 bg-black rounded-full border border-sinergia-gold/50 flex items-center gap-2">
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-sinergia-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sinergia-gold"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sinergia-gold">Nuevo</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="w-fit bg-white/15 backdrop-blur-md border border-white/20 p-3 rounded-2xl mb-4 text-white group-hover:bg-sinergia-gold group-hover:text-sinergia-black transition-all duration-300">
                <card.Icon size={22} weight="duotone" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-1.5">{card.title}</h3>
              <p className="text-white/70 font-medium text-sm leading-relaxed">{card.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Método LMT ───────────────────────────────────────────────────────────────

const perks = [
  'Coaching de experiencia "Lo Mejor de Ti" y capacitación en habilidades blandas[cite: 38].',
  'Combinado con clases de baile, rumba, zumba o yoga[cite: 39, 40].',
  'Actividades en su sede, al aire libre o en nuestras instalaciones[cite: 54].',
  'Programas adaptables para grupos desde 20 hasta más de 150 personas[cite: 91, 94].',
];

const MethodLMT = () => (
  <section id="empresas" className="py-32 bg-sinergia-black text-white relative overflow-hidden">
    <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-sinergia-gold/8 to-transparent pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20 relative z-10 h-[80dvh]">
      <motion.img 
        src="/Isotipo Dorado-Plateado.png"
        alt="Sinergia Isotipo"
        className="absolute -right-20 top-0 w-96 opacity-10 pointer-events-none hidden lg:block"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <FadeUp className="lg:w-1/2">
        <p className="text-sinergia-gold font-bold tracking-widest uppercase text-sm mb-5">B2B & Corporativo</p>
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-6">
          Potencia a tu
          <br />
          <span className="text-sinergia-gold">equipo de trabajo.</span>
        </h2>
        <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
          Con el Método <strong className="text-white">LMT — Lo Mejor de Ti</strong>, llevamos la Experiencia Sinergia a tu empresa. Unimos coaching, entrenamiento y baile para transformar el clima laboral.
        </p>
        <ul className="space-y-4 mb-10">
          {perks.map((p, i) => (
            <li key={i} className="flex items-start gap-3 text-white/80 font-medium">
              <CheckCircle size={20} weight="fill" className="text-sinergia-gold mt-0.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-white text-sinergia-black font-bold px-8 py-4 rounded-full hover:bg-sinergia-gold transition-colors duration-300 shadow-xl"
        >
          Solicitar Cotización B2B
        </motion.button>
      </FadeUp>

      <FadeUp className="lg:w-1/2 w-full" delay={0.2}>
        <div className="relative">
          <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-black/40 border border-white/5">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1080&q=80"
              alt="Método LMT — Team Building"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-sinergia-gold/15 to-transparent mix-blend-overlay" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 -left-6 bg-sinergia-gold p-6 rounded-2xl shadow-2xl hidden lg:block"
          >
            <p className="text-sinergia-black font-black text-4xl tracking-tighter">+40%</p>
            <p className="text-sinergia-black/70 font-bold text-sm">Productividad del equipo</p>
          </motion.div>
        </div>
      </FadeUp>
    </div>
  </section>
);

// ─── Testimonials ─────────────────────────────────────────────────────────────

const avatarData = [
  { top: '8%',  left: '8%',  size: 'w-16 h-16', img: 'https://i.pravatar.cc/150?img=47' },
  { top: '15%', left: '78%', size: 'w-24 h-24', img: 'https://i.pravatar.cc/150?img=32' },
  { top: '55%', left: '6%',  size: 'w-20 h-20', img: 'https://i.pravatar.cc/150?img=12' },
  { top: '65%', left: '76%', size: 'w-16 h-16', img: 'https://i.pravatar.cc/150?img=21' },
  { top: '38%', left: '88%', size: 'w-12 h-12', img: 'https://i.pravatar.cc/150?img=56' },
  { top: '80%', left: '30%', size: 'w-14 h-14', img: 'https://i.pravatar.cc/150?img=9' },
];

const Testimonials = () => (
  <section id="comunidad" className="relative min-h-[80vh] bg-[#F8F7F4] flex items-center justify-center overflow-hidden py-32">
    {avatarData.map((av, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
        animate={{ y: [0, i % 2 === 0 ? -14 : 14, 0] }}
        style={{ top: av.top, left: av.left }}
        className={`absolute ${av.size} rounded-full overflow-hidden border-4 border-white shadow-2xl shadow-black/15 cursor-pointer group`}
      >
        <img src={av.img} alt="Miembro comunidad" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
      </motion.div>
    ))}

    <FadeUp className="relative z-10 text-center max-w-3xl px-6">
      <p className="text-sinergia-gold font-bold tracking-widest uppercase text-sm mb-5">Comunidad</p>
      <h2 className="text-6xl md:text-9xl font-black text-sinergia-black tracking-tighter leading-none mb-6">
        +25,000
      </h2>
      <p className="text-3xl md:text-4xl font-black text-sinergia-gold tracking-tight mb-6">Vidas Impactadas.</p>
      <p className="text-xl text-black/50 font-medium leading-relaxed max-w-xl mx-auto">
        Sinergia tiene una de las tasas de transformación más altas en bienestar mental, físico y espiritual de la comunidad.
      </p>
    </FadeUp>
  </section>
);

// ─── Newsletter ───────────────────────────────────────────────────────────────

const Newsletter = () => (
  <section className="py-32 bg-sinergia-gold">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <FadeUp>
        <img src="/Isotipo Dorado-Plateado.png" alt="Sinergia Isotipo" className="w-16 h-16 mx-auto mb-8 opacity-40 brightness-0" />
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-sinergia-black leading-none mb-5">
          Mejora un 1%<br />cada día.
        </h2>
        <p className="text-lg text-sinergia-black/60 mb-10 font-medium leading-relaxed">
          Únete a nuestra comunidad y recibe herramientas de crecimiento mental, emocional y físico directamente en tu bandeja de entrada.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="tu@correo.com"
            required
            className="flex-1 px-6 py-4 rounded-full bg-white/40 border-2 border-sinergia-black/10 placeholder:text-sinergia-black/40 text-sinergia-black font-bold focus:outline-none focus:border-sinergia-black transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="inline-flex items-center gap-2 bg-sinergia-black text-white font-bold px-8 py-4 rounded-full hover:bg-sinergia-gray transition-colors shadow-xl"
          >
            <Envelope size={18} weight="bold" /> Suscríbete
          </motion.button>
        </form>
        <p className="mt-5 text-sm text-sinergia-black/40 italic">Sin spam. Solo valor real, cada semana.</p>
      </FadeUp>
    </div>
  </section>
);

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="bg-sinergia-black text-white pt-20 pb-12 border-t border-white/5">
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
          {[InstagramLogo, FacebookLogo, TwitterLogo].map((Icon, i) => (
            <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:bg-sinergia-gold hover:text-sinergia-black hover:border-transparent transition-all duration-300">
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

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function SinergiaLanding() {
  return (
    <div className="min-h-screen bg-sinergia-black font-sans antialiased selection:bg-sinergia-gold selection:text-sinergia-black">
      <Navbar />
      <Hero />
      <SocialProof />
      <Experiencias />
      <MethodLMT />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}