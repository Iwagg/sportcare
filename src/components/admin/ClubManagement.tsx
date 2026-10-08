import { useState, useEffect } from 'react';
import { Search, Building2, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Club } from '../../types';
import { Spinner, EmptyState } from '../ui/States';
import Modal from '../ui/Modal';

interface ClubManagementProps {
  darkMode: boolean;
}

export default function ClubManagement({ darkMode }: ClubManagementProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('clubs').select('*').order('created_at', { ascending: false });
    setClubs((data as Club[]) || []);
    setLoading(false);
  };

  const toggleVerification = async (club: Club) => {
    await supabase.from('clubs').update({ is_verified: !club.is_verified }).eq('id', club.id);
    await loadData();
  };

  const deleteClub = async (club: Club) => {
    if (!confirm(`Supprimer le club ${club.name} ?`)) return;
    await supabase.from('clubs').delete().eq('id', club.id);
    await loadData();
  };

  if (loading) return <Spinner />;

  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || (c.country || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerified = filterVerified === 'all' || (filterVerified === 'verified' && c.is_verified) || (filterVerified === 'pending' && !c.is_verified);
    return matchesSearch && matchesVerified;
  });

  const inputCls = `px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-red-500`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gestion des Clubs</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Administration et validation des clubs</p>
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Rechercher un club..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full pl-10 pr-4 py-2 ${inputCls}`} />
          </div>
          <select value={filterVerified} onChange={e => setFilterVerified(e.target.value)} className={inputCls}>
            <option value="all">Tous</option><option value="verified">Vérifiés</option><option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClubs.map((club) => (
            <div key={club.id} className={`p-5 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{club.name}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{club.sport} • {club.country || 'N/A'} • {club.league || 'N/A'}</p>
                  </div>
                </div>
                {club.is_verified ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Vérifié</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">En attente</span>
                )}
              </div>
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{club.description || 'Aucune description'}</p>
              <div className="flex gap-2">
                <button onClick={() => setSelectedClub(club)} className={`px-3 py-1.5 text-xs rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><Eye className="w-3.5 h-3.5 inline mr-1" />Voir détails</button>
                <button onClick={() => toggleVerification(club)} className={`px-3 py-1.5 text-xs rounded-md ${club.is_verified ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                  {club.is_verified ? <><XCircle className="w-3.5 h-3.5 inline mr-1" />Retirer validation</> : <><CheckCircle className="w-3.5 h-3.5 inline mr-1" />Valider</>}
                </button>
                <button onClick={() => deleteClub(club)} className="px-3 py-1.5 text-xs rounded-md hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5 inline mr-1" />Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <EmptyState icon={Building2} message="Aucun club trouvé" darkMode={darkMode} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-green-600">{clubs.filter(c => c.is_verified).length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Clubs vérifiés</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-yellow-600">{clubs.filter(c => !c.is_verified).length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>En attente</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-cyan-600">{clubs.length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p></div></div>
      </div>

      <Modal open={!!selectedClub} onClose={() => setSelectedClub(null)} title={selectedClub?.name || 'Club'} darkMode={darkMode}>
        {selectedClub && (
          <div className="space-y-3 text-sm">
            <Detail label="Sport" value={selectedClub.sport} darkMode={darkMode} />
            <Detail label="Pays" value={selectedClub.country} darkMode={darkMode} />
            <Detail label="Ligue" value={selectedClub.league} darkMode={darkMode} />
            <Detail label="Fondé en" value={selectedClub.founded?.toString()} darkMode={darkMode} />
            <Detail label="Site web" value={selectedClub.website} darkMode={darkMode} />
            <Detail label="Email contact" value={selectedClub.contact_email} darkMode={darkMode} />
            <Detail label="Téléphone" value={selectedClub.contact_phone} darkMode={darkMode} />
            <Detail label="Adresse" value={selectedClub.address} darkMode={darkMode} />
            <Detail label="Référent" value={`${selectedClub.referent_name} (${selectedClub.referent_role})`} darkMode={darkMode} />
            <Detail label="Email référent" value={selectedClub.referent_email} darkMode={darkMode} />
            <div><span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description:</span><p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{selectedClub.description || 'Aucune description'}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Detail({ label, value, darkMode }: { label: string; value?: string; darkMode: boolean }) {
  return (
    <div className="flex justify-between">
      <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{value || 'N/A'}</span>
    </div>
  );
}
