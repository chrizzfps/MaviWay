import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { LogOut, Users, Settings, Search, Trash2, Tag, ChevronDown, CheckCircle, Plus } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import StatusDropdown from '../components/StatusDropdown';
import LeadDrawer from '../components/LeadDrawer';
import AdminAddLeadModal from '../components/AdminAddLeadModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirectUrl, setRedirectUrl] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New States
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);

  // Fetch Leads
  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const leadsData = [];
      querySnapshot.forEach((doc) => {
        leadsData.push({ id: doc.id, ...doc.data() });
      });
      setLeads(leadsData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch Settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'config', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRedirectUrl(docSnap.data().redirectUrl || '');
        } else {
          // Initialize if it doesn't exist
          await setDoc(docRef, { redirectUrl: 'https://maviway.com' });
          setRedirectUrl('https://maviway.com');
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateDoc(doc(db, 'config', 'general'), {
        redirectUrl: redirectUrl
      });
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error('Failed to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteLead = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3 font-sans w-full">
        <p className="text-sm font-medium text-gray-900">Are you sure you want to delete this lead?</p>
        <div className="flex gap-2 justify-end">
          <button 
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button 
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await deleteDoc(doc(db, 'leads', id));
                toast.success('Lead deleted successfully');
              } catch (error) {
                console.error("Error deleting lead:", error);
                toast.error('Failed to delete lead');
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'new' ? 'contacted' : 'new';
    try {
      await updateDoc(doc(db, 'leads', id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleLeads = filteredLeads.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
           <img src="/images/Logo Azul.png" alt="MaviWay" className="h-8" />
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 relative">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'leads' ? 'bg-blue-50 text-mavi-blue' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={18} /> Leads
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'settings' ? 'bg-blue-50 text-mavi-blue' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings size={18} /> Settings
          </button>

          <div className="absolute bottom-6 left-4 right-4 border-t border-gray-200 pt-4">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
           <img src="/images/Logo Azul.png" alt="MaviWay" className="h-6" />
           <div className="flex gap-2">
             <button onClick={() => setActiveTab('leads')} className={`p-2 rounded ${activeTab === 'leads' ? 'bg-blue-50 text-mavi-blue' : 'text-gray-600'}`}><Users size={20}/></button>
             <button onClick={() => setActiveTab('settings')} className={`p-2 rounded ${activeTab === 'settings' ? 'bg-blue-50 text-mavi-blue' : 'text-gray-600'}`}><Settings size={20}/></button>
             <button onClick={handleLogout} className="p-2 text-red-600"><LogOut size={20}/></button>
           </div>
        </header>

        {activeTab === 'leads' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-accentBold text-gray-900">Platform Leads</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage all captured contacts from the landing page.</p>
                </div>
                
                <div className="flex gap-4 items-center w-full md:w-auto mt-4 md:mt-0">
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search by name or email..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full md:w-64 text-sm focus:ring-1 focus:ring-mavi-blue focus:border-mavi-blue"
                    />
                  </div>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-shrink-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <Plus size={18} />
                    <span className="hidden sm:inline">Añadir Lead</span>
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="px-6 py-4 text-left">Contact Info</th>
                        <th className="px-6 py-4 text-left">Phone</th>
                        <th className="px-6 py-4 text-left">Date</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {loading ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading leads...</td></tr>
                      ) : visibleLeads.length === 0 ? (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No leads found.</td></tr>
                      ) : (
                        visibleLeads.map((lead) => (
                          <tr 
                            key={lead.id} 
                            onClick={() => setSelectedLead(lead)}
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{lead.name}</div>
                              <div className="text-gray-500 text-xs mt-0.5">{lead.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {lead.phone || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                              {lead.createdAt?.toDate ? format(lead.createdAt.toDate(), 'PPP p') : 'Just now'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <StatusDropdown leadId={lead.id} currentStatus={lead.status || 'new'} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-400">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLead(lead.id);
                                }} 
                                className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* View More Button */}
              {visibleCount < filteredLeads.length && (
                <div className="flex justify-center mt-6">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 15)}
                    className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Ver más leads
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-accentBold text-gray-900 mb-8">System Settings</h1>
              
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 md:p-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Landing Page Redirect</h2>
                  <p className="text-sm text-gray-500 mb-6">Set the URL destination where users will be redirected after submitting the lead capture form.</p>
                  
                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Destination URL</label>
                      <input 
                        type="url" 
                        id="url"
                        required
                        value={redirectUrl}
                        onChange={(e) => setRedirectUrl(e.target.value)}
                        placeholder="https://example.com/thank-you"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-mavi-blue focus:border-mavi-blue"
                      />
                    </div>
                    
                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={savingSettings}
                        className="px-6 py-2.5 bg-mavi-blue text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-70 shadow-sm"
                      >
                        {savingSettings ? 'Saving...' : 'Save Configuration'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-out Drawer for Lead Details */}
      <LeadDrawer 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)} 
        onDeleted={() => setSelectedLead(null)}
      />

      {/* Modal for Adding Manual Lead */}
      <AdminAddLeadModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
