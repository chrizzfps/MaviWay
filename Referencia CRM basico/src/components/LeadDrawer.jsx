import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Mail, Phone, Calendar, FileText, Trash2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import StatusDropdown from './StatusDropdown';

export default function LeadDrawer({ lead, isOpen, onClose, onUpdated, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        notes: lead.notes || '',
      });
      setIsEditing(false);
    }
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!lead?.id) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'leads', lead.id), {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes
      });
      toast.success('Lead actualizado correctamente');
      setIsEditing(false);
      if (onUpdated) onUpdated();
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    // We can use a toast custom toast or a simple confirm for deletion here.
    // Let's use standard confirm or a toast custom UI.
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este lead?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'leads', lead.id));
      toast.success('Lead eliminado exitosamente');
      if (onDeleted) onDeleted();
      onClose();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error('Ocurrió un error al eliminar el lead');
    }
  };

  if (!lead) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', boxShadow: '-10px 0 30px rgba(0,0,0,0)' }}
            animate={{ x: 0, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}
            exit={{ x: '100%', boxShadow: '-10px 0 30px rgba(0,0,0,0)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white z-50 flex flex-col overflow-hidden border-l border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-accentBold text-gray-900">Detalles del Lead</h2>
                <p className="text-sm text-gray-500 font-accentLight mt-1">ID: {lead.id.slice(0, 8)}...</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Status Section */}
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Estado del Lead</span>
                  <StatusDropdown leadId={lead.id} currentStatus={lead.status || 'new'} />
                </div>
              </div>

              {/* Editable Fields Form */}
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase">Información de Contacto</h3>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Editar campos
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data to current lead data
                        setFormData({
                          name: lead.name || '',
                          email: lead.email || '',
                          phone: lead.phone || '',
                          notes: lead.notes || '',
                        });
                      }}
                      className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>

                {/* Name */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <User size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    Nombre Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 rounded-xl border border-transparent bg-gray-50/50 text-gray-900">
                      {lead.name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Mail size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    Correo Electrónico
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 rounded-xl border border-transparent bg-gray-50/50 text-gray-900">
                      {lead.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Phone size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                    />
                  ) : (
                    <div className="w-full px-4 py-2.5 rounded-xl border border-transparent bg-gray-50/50 text-gray-900">
                      {lead.phone}
                    </div>
                  )}
                </div>

                {/* Date created (Read Only) */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Calendar size={16} className="text-gray-400" />
                    Registrado el
                  </label>
                  <div className="w-full px-4 py-2.5 rounded-xl border border-transparent bg-gray-50/50 text-gray-500 text-sm">
                    {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleString() : new Date(lead.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Notes */}
                <div className="group pt-2">
                  <h3 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-4">Notas Internas</h3>
                  <label className="hidden text-sm font-medium text-gray-700 mb-1.5">
                    Notas
                  </label>
                  {isEditing ? (
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Añadir notas sobre este lead..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm resize-none"
                    />
                  ) : (
                    <div className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-yellow-50/30 text-gray-800 min-h-[100px] whitespace-pre-wrap">
                      {lead.notes || <span className="text-gray-400 italic">No hay notas para este lead.</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>

              {isEditing ? (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                >
                  Cerrar
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
