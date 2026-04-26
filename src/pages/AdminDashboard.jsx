import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, deleteDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { Users, Gear, SignOut, MagnifyingGlass, Trash, Plus, X, Phone, EnvelopeSimple, User, CaretDown, Sun, Moon, DotsThreeVertical, WhatsappLogo, Funnel, SortAscending } from '@phosphor-icons/react';
import { signOut } from 'firebase/auth';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  new: { label: 'Nuevo', dark: 'bg-gold-500/10 text-gold-400 border-gold-500/20', light: 'bg-gold-50 text-gold-700 border-gold-200' },
  contacted: { label: 'Contactado', dark: 'bg-blue-500/10 text-blue-400 border-blue-500/20', light: 'bg-blue-50 text-blue-700 border-blue-200' },
  converted: { label: 'Convertido', dark: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', light: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  discarded: { label: 'Descartado', dark: 'bg-slate-500/10 text-slate-400 border-slate-500/20', light: 'bg-slate-50 text-slate-700 border-slate-200' },
};

function StatusBadge({ leadId, currentStatus, theme }) {
  const [open, setOpen] = useState(false);
  const statuses = Object.keys(STATUS_CONFIG);
  const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.new;
  const colorClass = theme === 'dark' ? cfg.dark : cfg.light;

  const handleChange = async (newStatus) => {
    setOpen(false);
    try {
      await updateDoc(doc(db, 'farmasi_leads', leadId), { status: newStatus });
    } catch (err) { toast.error('Error'); }
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all ${colorClass}`}
      >
        {cfg.label} <CaretDown size={10} weight="bold" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            className={`absolute right-0 top-8 z-50 w-36 border rounded-lg shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-[#1A1A1A] border-white/5' : 'bg-white border-slate-200'}`}
          >
            {statuses.map(s => (
              <button
                key={s}
                onClick={(e) => { e.stopPropagation(); handleChange(s); }}
                className={`w-full text-left px-3 py-2 text-[11px] font-bold ${s === currentStatus ? 'text-sinergia-gold' : (theme === 'dark' ? 'text-white/60' : 'text-slate-600')} hover:bg-white/5 transition-colors`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Lead Drawer ──────────────────────────────────────────────────────────────
function LeadDrawer({ lead, isOpen, onClose, theme }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({ name: lead.name || '', email: lead.email || '', phone: lead.phone || '', notes: lead.notes || '' });
      setIsEditing(false);
    }
  }, [lead]);

  const handleSave = async () => {
    if (!lead?.id) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'farmasi_leads', lead.id), formData);
      toast.success('Lead actualizado');
      setIsEditing(false);
    } catch { toast.error('Error'); }
    finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este lead? Esta acción no se puede deshacer.')) {
      try {
        await deleteDoc(doc(db, 'farmasi_leads', lead.id));
        toast.success('Lead eliminado');
        onClose();
      } catch { toast.error('Error al eliminar'); }
    }
  };

  if (!lead) return null;

  const bgPanel = theme === 'dark' ? 'bg-[#0F0F0F] text-white' : 'bg-white text-slate-900';
  const borderCol = theme === 'dark' ? 'border-white/5' : 'border-slate-200';
  const inputBg = theme === 'dark' ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed inset-y-0 right-0 w-full md:w-[420px] ${bgPanel} border-l ${borderCol} z-[101] flex flex-col shadow-2xl`}
          >
            <div className={`flex items-center justify-between px-6 py-5 border-b ${borderCol}`}>
              <div className="flex items-center gap-3">
                <button onClick={handleDelete} className="p-2 text-red-500/40 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all" title="Eliminar Lead">
                  <Trash size={20} weight="bold" />
                </button>
                <h2 className="text-base font-black uppercase tracking-tight">Detalles del Lead</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all"><X size={20} weight="bold" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className={`p-4 rounded-xl border ${borderCol} ${theme === 'dark' ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Estado</span>
                  <StatusBadge leadId={lead.id} currentStatus={lead.status || 'new'} theme={theme} />
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sinergia-gold">Información Básica</h3>
                  <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-black uppercase text-slate-500 hover:text-sinergia-gold transition-colors">
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </button>
                </div>

                {[{ label: 'Nombre', name: 'name' }, { label: 'Email', name: 'email' }, { label: 'Teléfono', name: 'phone' }].map(f => (
                  <div key={f.name}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={formData[f.name]} 
                        onChange={e => setFormData(p => ({ ...p, [f.name]: e.target.value }))}
                        className={`w-full px-4 py-2.5 rounded-none text-sm outline-none border focus:border-sinergia-gold transition-all ${inputBg}`}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{lead[f.name] || '—'}</div>
                        {f.name === 'phone' && lead.phone && (
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all rounded-lg"
                            title="Chatear por WhatsApp"
                          >
                            <WhatsappLogo size={14} weight="fill" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Notas</label>
                  {isEditing ? (
                    <textarea 
                      value={formData.notes} 
                      onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                      rows={3}
                      className={`w-full px-4 py-3 rounded-none text-sm outline-none border focus:border-sinergia-gold transition-all resize-none ${inputBg}`}
                    />
                  ) : (
                    <div className={`p-4 text-xs min-h-[80px] whitespace-pre-wrap ${theme === 'dark' ? 'text-white/60' : 'text-slate-600'}`}>{lead.notes || 'No hay notas.'}</div>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className={`p-6 border-t ${borderCol}`}>
                <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-sinergia-gold text-sinergia-black font-black text-sm uppercase tracking-widest">
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [theme, setTheme] = useState(() => localStorage.getItem('admin-theme') || 'light');
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [farmasiUrl, setFarmasiUrl] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('admin-theme', theme);
  }, [theme]);

  useEffect(() => {
    const q = query(collection(db, 'farmasi_leads'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    getDoc(doc(db, 'config', 'general')).then(snap => {
      if (snap.exists()) setFarmasiUrl(snap.data().farmasiUrl || '');
    });
  }, []);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const handleLogout = () => signOut(auth);

  const filtered = leads
    .filter(l => {
      const matchesSearch = !searchTerm || 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone?.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || (l.status || 'new') === filterStatus;
      
      const matchesCountry = filterCountry === 'all' || (l.phone && l.phone.startsWith(filterCountry));
      
      return matchesSearch && matchesStatus && matchesCountry;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      }
      if (sortBy === 'oldest') {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeA - timeB;
      }
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#050505]' : 'bg-slate-50';
  const bgSide = isDark ? 'bg-[#0A0A0A]' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-white/40' : 'text-slate-500';
  const borderCol = isDark ? 'border-white/5' : 'border-slate-200';
  const inputBg = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans ${bgMain} ${textPrimary} transition-colors duration-300 overflow-hidden relative`}>
      {/* Sidebar - Desktop Only */}
      <aside className={`hidden md:flex w-64 border-r ${borderCol} flex-col ${bgSide} z-50`}>
        <div className={`h-20 flex items-center px-6 border-b ${borderCol}`}>
          <img src={isDark ? "/Logo Blanco.png" : "/Logo Blanco.png"} alt="Logo" className={`h-6 w-auto object-contain ${!isDark ? 'invert' : ''}`} />
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('leads')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'leads' ? (isDark ? 'bg-white/5 text-sinergia-gold border-r-2 border-sinergia-gold' : 'bg-slate-100 text-sinergia-gold border-r-2 border-sinergia-gold') : 'text-slate-500 hover:text-sinergia-gold'}`}>
            <Users size={18} /> <span>Leads</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'settings' ? (isDark ? 'bg-white/5 text-sinergia-gold border-r-2 border-sinergia-gold' : 'bg-slate-100 text-sinergia-gold border-r-2 border-sinergia-gold') : 'text-slate-500 hover:text-sinergia-gold'}`}>
            <Gear size={18} /> <span>Ajustes</span>
          </button>
        </nav>

        <div className={`p-6 border-t ${borderCol}`}>
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg border ${borderCol} text-xs font-bold transition-all hover:bg-sinergia-gold hover:text-sinergia-black`}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>
          <button onClick={handleLogout} className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-colors">
            <SignOut size={16} /> <span>Salir</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 h-screen overflow-hidden">
        <header className={`h-20 border-b ${borderCol} flex items-center justify-between px-4 md:px-8 bg-transparent shrink-0`}>
          <div className="flex items-center gap-4 flex-1">
            <MagnifyingGlass className={textSecondary} size={18} />
            <input 
              type="text" 
              placeholder="BUSCAR CONTACTO..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`bg-transparent border-none outline-none text-xs font-black tracking-[0.2em] w-full max-w-md placeholder:opacity-20 ${textPrimary}`}
            />
          </div>
          <div className="flex items-center gap-4">
             <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-sinergia-gold/20' : 'bg-slate-200'} flex items-center justify-center text-[10px] font-black text-sinergia-gold`}>AD</div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col">
          {activeTab === 'leads' ? (
            <div className="flex-1 flex flex-col min-h-0 p-4 md:p-10">
              <div className="max-w-6xl w-full mx-auto flex flex-col h-full">
                {/* Header & Filters Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 shrink-0">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-1">Dashboard de Leads</h1>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${textSecondary}`}>Gestión activa de contactos registrados</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Funnel size={14} className={textSecondary} />
                      <select 
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className={`pl-2 pr-8 py-2 text-[10px] font-black uppercase tracking-widest outline-none border ${borderCol} ${inputBg} cursor-pointer hover:border-sinergia-gold transition-colors appearance-none bg-no-repeat bg-[right_0.5rem_center]`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? 'white' : 'black'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '12px' }}
                      >
                        <option value="all">TODOS LOS ESTADOS</option>
                        <option value="new">NUEVO</option>
                        <option value="contacted">CONTACTADO</option>
                        <option value="converted">CONVERTIDO</option>
                        <option value="discarded">DESCARTADO</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <Funnel size={14} className={textSecondary} />
                      <select 
                        value={filterCountry}
                        onChange={e => setFilterCountry(e.target.value)}
                        className={`pl-2 pr-8 py-2 text-[10px] font-black uppercase tracking-widest outline-none border ${borderCol} ${inputBg} cursor-pointer hover:border-sinergia-gold transition-colors appearance-none bg-no-repeat bg-[right_0.5rem_center]`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? 'white' : 'black'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '12px' }}
                      >
                        <option value="all">TODOS LOS PAÍSES</option>
                        <option value="+57">COLOMBIA (+57)</option>
                        <option value="+58">VENEZUELA (+58)</option>
                        <option value="+52">MÉXICO (+52)</option>
                        <option value="+34">ESPAÑA (+34)</option>
                        <option value="+1">USA/CANADÁ (+1)</option>
                        <option value="+593">ECUADOR (+593)</option>
                        <option value="+51">PERÚ (+51)</option>
                        <option value="+56">CHILE (+56)</option>
                        <option value="+54">ARGENTINA (+54)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <SortAscending size={14} className={textSecondary} />
                      <select 
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className={`pl-2 pr-8 py-2 text-[10px] font-black uppercase tracking-widest outline-none border ${borderCol} ${inputBg} cursor-pointer hover:border-sinergia-gold transition-colors appearance-none bg-no-repeat bg-[right_0.5rem_center]`}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${isDark ? 'white' : 'black'}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundSize: '12px' }}
                      >
                        <option value="newest">MÁS RECIENTES</option>
                        <option value="oldest">MÁS ANTIGUOS</option>
                        <option value="name">POR NOMBRE (A-Z)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Scrollable List Area */}
                <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                  {/* Desktop Table View */}
                  <div className={`hidden md:block flex-1 overflow-y-auto ${bgSide} border ${borderCol} shadow-sm custom-scrollbar`}>
                    <table className="w-full text-left sticky-header">
                      <thead className={`sticky top-0 z-10 ${bgSide}`}>
                        <tr className={`border-b ${borderCol} ${isDark ? 'bg-white/[0.01]' : 'bg-slate-50'}`}>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contacto</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">WhatsApp</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fuente</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hidden lg:table-cell">Fecha</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Estado</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Detalle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {loading ? (
                          <tr><td colSpan="6" className="px-6 py-12 text-center text-xs font-black uppercase tracking-widest opacity-20">Analizando leads...</td></tr>
                        ) : filtered.length === 0 ? (
                          <tr><td colSpan="6" className="px-6 py-12 text-center text-xs font-black uppercase tracking-widest opacity-20">Cero resultados.</td></tr>
                        ) : (
                          filtered.map(lead => (
                            <tr key={lead.id} onClick={() => setSelectedLead(lead)} className={`group transition-all cursor-pointer ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                              <td className="px-6 py-5">
                                <div className="text-xs font-black uppercase tracking-tight">{lead.name}</div>
                                <div className="text-[10px] font-medium opacity-40">{lead.email}</div>
                              </td>
                              <td className={`px-6 py-5 text-[11px] font-bold ${textSecondary}`}>{lead.phone || '—'}</td>
                              <td className="px-6 py-5">
                                {(() => {
                                  const rawSource = lead.source || 'GENERAL';
                                  const isFarmasi = rawSource.toLowerCase().includes('farmasi');
                                  const label = isFarmasi ? 'FARMASI' : (rawSource.toLowerCase().includes('home') || rawSource.toLowerCase().includes('sinergia') ? 'HOME' : rawSource.toUpperCase().replace(/_/g, ' '));
                                  return (
                                    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter ${isFarmasi ? 'bg-[#D4A373]/10 text-[#D4A373]' : 'bg-sinergia-gold/10 text-sinergia-gold'}`}>
                                      {label}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className={`px-6 py-5 text-[10px] font-black uppercase hidden lg:table-cell ${textSecondary}`}>
                                {lead.createdAt?.toDate ? format(lead.createdAt.toDate(), 'dd MMM yyyy', { locale: es }) : '—'}
                              </td>
                              <td className="px-6 py-5 text-center" onClick={e => e.stopPropagation()}>
                                <StatusBadge leadId={lead.id} currentStatus={lead.status || 'new'} theme={theme} />
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <DotsThreeVertical size={20} className="inline opacity-20 group-hover:opacity-100 transition-opacity" />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {loading ? (
                      <div className="py-12 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-20">Analizando leads...</div>
                    ) : filtered.length === 0 ? (
                      <div className="py-12 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-20">Sin resultados.</div>
                    ) : (
                      filtered.map(lead => (
                        <div 
                          key={lead.id} 
                          onClick={() => setSelectedLead(lead)}
                          className={`${bgSide} border ${borderCol} p-4 active:scale-[0.98] transition-transform`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="text-xs font-black uppercase tracking-tight truncate">{lead.name}</div>
                              <div className="text-[10px] font-medium opacity-40 truncate">{lead.email}</div>
                            </div>
                            <div onClick={e => e.stopPropagation()}>
                              <StatusBadge leadId={lead.id} currentStatus={lead.status || 'new'} theme={theme} />
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <WhatsappLogo size={14} className="text-green-500/60" />
                                <span className={`text-[10px] font-bold ${textSecondary}`}>{lead.phone || '—'}</span>
                              </div>
                              {(() => {
                                const rawSource = lead.source || 'GENERAL';
                                const isFarmasi = rawSource.toLowerCase().includes('farmasi');
                                const label = isFarmasi ? 'FARMASI' : (rawSource.toLowerCase().includes('home') || rawSource.toLowerCase().includes('sinergia') ? 'HOME' : rawSource.toUpperCase().replace(/_/g, ' '));
                                return (
                                  <span className={`w-fit px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${isFarmasi ? 'bg-[#D4A373]/10 text-[#D4A373]' : 'bg-sinergia-gold/10 text-sinergia-gold'}`}>
                                    {label}
                                  </span>
                                );
                              })()}
                            </div>
                            <div className={`text-[9px] font-black uppercase tracking-widest ${textSecondary}`}>
                              {lead.createdAt?.toDate ? format(lead.createdAt.toDate(), 'dd MMM', { locale: es }) : '—'}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-12">
              <div className="max-w-2xl mx-auto">
               <div className="mb-12">
                <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Ajustes del Sistema</h1>
                <p className={`text-xs font-bold uppercase tracking-widest ${textSecondary}`}>Configuración de flujos y redirecciones</p>
              </div>

              <div className={`${bgSide} border ${borderCol} p-10`}>
                <h2 className="text-sm font-black uppercase tracking-widest mb-2">Redirección Farmasi</h2>
                <p className={`text-xs mb-8 ${textSecondary}`}>Define a dónde viaja el usuario después de aplicar.</p>
                
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  setSavingSettings(true);
                  try {
                    await setDoc(doc(db, 'config', 'general'), { farmasiUrl }, { merge: true });
                    toast.success('Configuración actualizada');
                  } catch { toast.error('Error'); }
                  finally { setSavingSettings(false); }
                }} className="space-y-6">
                  <input
                    type="url" required
                    value={farmasiUrl}
                    onChange={e => setFarmasiUrl(e.target.value)}
                    className={`w-full px-5 py-4 text-xs font-bold outline-none border transition-all rounded-none ${inputBg} focus:border-sinergia-gold`}
                  />
                  <button type="submit" disabled={savingSettings} className="px-8 py-4 bg-sinergia-gold text-sinergia-black font-black text-xs uppercase tracking-widest shadow-lg shadow-sinergia-gold/20">
                    {savingSettings ? 'Guardando...' : 'Aplicar Cambios'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>

      <LeadDrawer lead={selectedLead} isOpen={!!selectedLead} onClose={() => setSelectedLead(null)} theme={theme} />

      {/* Bottom Nav - Mobile Only */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 h-16 ${bgSide} border-t ${borderCol} flex items-center justify-around z-50 px-2`}>
        <button onClick={() => setActiveTab('leads')} className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${activeTab === 'leads' ? 'text-sinergia-gold' : 'text-slate-500'}`}>
          <Users size={20} weight={activeTab === 'leads' ? 'fill' : 'bold'} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Leads</span>
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${activeTab === 'settings' ? 'text-sinergia-gold' : 'text-slate-500'}`}>
          <Gear size={20} weight={activeTab === 'settings' ? 'fill' : 'bold'} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Ajustes</span>
        </button>
        <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-slate-500">
          {isDark ? <Sun size={20} weight="bold" /> : <Moon size={20} weight="bold" />}
          <span className="text-[10px] font-black uppercase tracking-tighter">{isDark ? 'Claro' : 'Oscuro'}</span>
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-red-500/60">
          <SignOut size={20} weight="bold" />
          <span className="text-[10px] font-black uppercase tracking-tighter">Salir</span>
        </button>
      </nav>
    </div>
  );
}
