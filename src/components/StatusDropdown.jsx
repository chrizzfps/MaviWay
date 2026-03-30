import React, { useState, useRef, useEffect } from 'react';
import { Tag, CheckCircle, ChevronDown } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const STATUS_OPTIONS = [
  { id: 'new', label: 'New', icon: Tag, colorClass: 'text-blue-700', bgClass: 'bg-blue-50', borderClass: 'border-blue-200' },
  { id: 'contacted', label: 'Contacted', icon: CheckCircle, colorClass: 'text-green-700', bgClass: 'bg-green-50', borderClass: 'border-green-200' },
  // Can add 'converted', 'rejected' etc. here easily
];

export default function StatusDropdown({ leadId, currentStatus }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = async (newStatusId) => {
    if (newStatusId === currentStatus) {
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'leads', leadId), {
        status: newStatusId
      });
      toast.success('Estado actualizado');
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error('Error al actualizar');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const activeOption = STATUS_OPTIONS.find(opt => opt.id === currentStatus) || STATUS_OPTIONS[0];
  const Icon = activeOption.icon;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={(e) => {
           e.stopPropagation(); // Prevent row click
           setIsOpen(!isOpen);
        }}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all shadow-sm ${activeOption.bgClass} ${activeOption.colorClass} ${activeOption.borderClass} hover:opacity-80 active:scale-95 disabled:opacity-50`}
      >
        <Icon size={14} />
        {loading ? '...' : activeOption.label}
        <ChevronDown size={14} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-36 rounded-xl bg-white shadow-xl border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden origin-top-right right-0 md:left-0">
          <div className="py-1">
            {STATUS_OPTIONS.map((option) => {
              const OptIcon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(option.id);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors
                    ${currentStatus === option.id ? 'bg-gray-50 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <OptIcon size={16} className={option.colorClass} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
