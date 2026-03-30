import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tag, CheckCircle, Clock, XCircle, ChevronDown } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const STATUS_OPTIONS = [
  { id: 'new',         label: 'Nuevo',        icon: Tag,         colorClass: 'text-blue-700',   bgClass: 'bg-blue-50',   borderClass: 'border-blue-200' },
  { id: 'contacted',   label: 'Contactado',   icon: CheckCircle, colorClass: 'text-green-700',  bgClass: 'bg-green-50',  borderClass: 'border-green-200' },
  { id: 'in_progress', label: 'En Progreso',  icon: Clock,       colorClass: 'text-amber-700',  bgClass: 'bg-amber-50',  borderClass: 'border-amber-200' },
  { id: 'closed',      label: 'Cerrado',      icon: XCircle,     colorClass: 'text-gray-600',   bgClass: 'bg-gray-100',  borderClass: 'border-gray-300' },
];

// Portal dropdown rendered directly in <body> to escape overflow:hidden parents
function DropdownPortal({ anchorRef, onClose, children }) {
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }

    // Close on scroll/resize so it doesn't drift
    const close = () => onClose();
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [anchorRef, onClose]);

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        minWidth: coords.width,
        zIndex: 99999,
      }}
    >
      {children}
    </div>,
    document.body
  );
}

export default function StatusDropdown({ leadId, currentStatus, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleStatusChange = async (newStatusId) => {
    if (newStatusId === currentStatus) { setIsOpen(false); return; }
    setLoading(true);
    try {
      await updateDoc(doc(db, 'leads', leadId), { status: newStatusId });
      toast.success('Estado actualizado');
      if (onStatusChange) onStatusChange(newStatusId);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Error al actualizar');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const activeOption = STATUS_OPTIONS.find(opt => opt.id === currentStatus) || STATUS_OPTIONS[0];
  const Icon = activeOption.icon;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={(e) => { e.stopPropagation(); setIsOpen(prev => !prev); }}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all shadow-sm
          ${activeOption.bgClass} ${activeOption.colorClass} ${activeOption.borderClass}
          hover:opacity-80 active:scale-95 disabled:opacity-50`}
      >
        <Icon size={14} />
        {loading ? '...' : activeOption.label}
        <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <DropdownPortal anchorRef={buttonRef} onClose={() => setIsOpen(false)}>
          <div
            className="rounded-xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {STATUS_OPTIONS.map((option) => {
              const OptIcon = option.icon;
              const isActive = currentStatus === option.id;
              return (
                <button
                  key={option.id}
                  onClick={(e) => { e.stopPropagation(); handleStatusChange(option.id); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors
                    ${isActive ? `${option.bgClass} font-semibold ${option.colorClass}` : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <OptIcon size={15} className={isActive ? option.colorClass : 'text-gray-400'} />
                  {option.label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
                </button>
              );
            })}
          </div>
        </DropdownPortal>
      )}
    </>
  );
}
