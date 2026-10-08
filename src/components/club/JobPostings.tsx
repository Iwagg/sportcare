import { useState, useEffect } from 'react';
import { Plus, Eye, Users, Calendar, Edit3, Trash2, Pause, Play, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { JobPosting, Club } from '../../types';
import { Spinner, EmptyState } from '../ui/States';
import Modal from '../ui/Modal';

interface JobPostingsProps {
  darkMode: boolean;
}

const emptyForm = {
  title: '', description: '', position: '', type: 'recruitment' as JobPosting['type'],
  sport: 'football' as 'football' | 'basketball', level: '', ageMin: 18, ageMax: 35,
  availability_date: new Date().toISOString().slice(0, 10), expiry_date: new Date().toISOString().slice(0, 10),
  duration: '', salary: '', benefits: '',
};

export default function JobPostings({ darkMode }: JobPostingsProps) {
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data: clubData } = await supabase.from('clubs').select('*').eq('user_id', user!.id).maybeSingle();
    setClub(clubData as Club | null);
    if (clubData) {
      const { data: postData } = await supabase.from('job_postings').select('*').eq('club_id', clubData.id).order('created_at', { ascending: false });
      setPostings((postData as JobPosting[]) || []);
    }
    setLoading(false);
  };

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: JobPosting) => {
    setEditId(p.id);
    setForm({
      title: p.title, description: p.description, position: p.position, type: p.type, sport: p.sport,
      level: p.requirements.level || '', ageMin: p.requirements.ageMin || 18, ageMax: p.requirements.ageMax || 35,
      availability_date: p.availability_date || new Date().toISOString().slice(0, 10),
      expiry_date: p.expiry_date || new Date().toISOString().slice(0, 10),
      duration: p.contract.duration || '', salary: p.contract.salary || '', benefits: (p.contract.benefits || []).join(', '),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!club) return;
    const payload = {
      club_id: club.id, title: form.title, description: form.description, position: form.position,
      type: form.type, sport: form.sport,
      requirements: { ageMin: form.ageMin, ageMax: form.ageMax, level: form.level },
      contract: { duration: form.duration, salary: form.salary, benefits: form.benefits.split(',').map(s => s.trim()).filter(Boolean) },
      availability_date: form.availability_date, expiry_date: form.expiry_date,
      status: 'active' as const,
    };
    if (editId) {
      await supabase.from('job_postings').update(payload).eq('id', editId);
    } else {
      await supabase.from('job_postings').insert(payload);
    }
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette offre ?')) return;
    await supabase.from('job_postings').delete().eq('id', id);
    await loadData();
  };

  const toggleStatus = async (p: JobPosting) => {
    const newStatus = p.status === 'active' ? 'paused' : 'active';
    await supabase.from('job_postings').update({ status: newStatus }).eq('id', p.id);
    await loadData();
  };

  if (loading) return <Spinner />;

  if (!club) {
    return (
      <div className="space-y-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Offres d'Emploi</h1>
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <EmptyState icon={Plus} message="Vous devez d'abord configurer votre profil club pour publier des offres." darkMode={darkMode} />
        </div>
      </div>
    );
  }

  const getStatusColor = (s: string) => ({ active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }[s] || '');
  const getStatusLabel = (s: string) => ({ active: 'Active', paused: 'En pause', closed: 'Fermée', expired: 'Expirée' }[s] || '');
  const getTypeLabel = (t: string) => ({ recruitment: 'Recrutement', trial: 'Essai', temporary: 'Temporaire', loan: 'Prêt' }[t] || '');

  const filteredPostings = postings.filter(p => filterStatus === 'all' || p.status === filterStatus);
  const inputCls = `w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Offres d'Emploi</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Gestion de vos annonces de recrutement</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvelle offre
        </button>
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-4 flex-wrap">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Filtrer par statut:</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={inputCls}>
            <option value="all">Toutes les offres</option><option value="active">Actives</option><option value="paused">En pause</option><option value="closed">Fermées</option><option value="expired">Expirées</option>
          </select>
        </div>
      </div>

      {filteredPostings.length > 0 ? (
        <div className="space-y-4">
          {filteredPostings.map((posting) => (
            <div key={posting.id} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(posting.status)}`}>{getStatusLabel(posting.status)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`}>{getTypeLabel(posting.type)}</span>
                  </div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.title}</h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{posting.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(posting)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => toggleStatus(posting)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>{posting.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
                  <button onClick={() => handleDelete(posting.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Poste</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.position}</span></div>
                <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Âge requis</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.requirements.ageMin || '?'}-{posting.requirements.ageMax || '?'} ans</span></div>
                <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Niveau</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.requirements.level || 'N/A'}</span></div>
                <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disponibilité</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.availability_date ? new Date(posting.availability_date).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-6 text-sm flex-wrap">
                  <div className="flex items-center gap-1"><Eye className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{posting.views} vues</span></div>
                  <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{posting.applications} candidatures</span></div>
                  <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Expire le {posting.expiry_date ? new Date(posting.expiry_date).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <EmptyState icon={Plus} message="Aucune offre. Cliquez sur « Nouvelle offre » pour commencer." darkMode={darkMode} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-green-600">{postings.filter(p => p.status === 'active').length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Offres actives</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-blue-600">{postings.reduce((a, p) => a + p.views, 0)}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Vues totales</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-orange-600">{postings.reduce((a, p) => a + p.applications, 0)}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Candidatures</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-cyan-600">{postings.length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total offres</p></div></div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Modifier l\'offre' : 'Nouvelle offre'} darkMode={darkMode}>
        <div className="space-y-4">
          <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Titre</span><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={`w-full mt-1 ${inputCls}`} /></label>
          <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</span><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={`w-full mt-1 ${inputCls}`} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Poste</span><input value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className={`w-full mt-1 ${inputCls}`} /></label>
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</span><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as JobPosting['type'] })} className={`w-full mt-1 ${inputCls}`}><option value="recruitment">Recrutement</option><option value="trial">Essai</option><option value="temporary">Temporaire</option><option value="loan">Prêt</option></select></label>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sport</span><select value={form.sport} onChange={e => setForm({ ...form, sport: e.target.value as 'football' | 'basketball' })} className={`w-full mt-1 ${inputCls}`}><option value="football">Football</option><option value="basketball">Basketball</option></select></label>
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Âge min</span><input type="number" value={form.ageMin} onChange={e => setForm({ ...form, ageMin: +e.target.value })} className={`w-full mt-1 ${inputCls}`} /></label>
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Âge max</span><input type="number" value={form.ageMax} onChange={e => setForm({ ...form, ageMax: +e.target.value })} className={`w-full mt-1 ${inputCls}`} /></label>
          </div>
          <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Niveau requis</span><input value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} placeholder="Ex: Professionnel, Semi-pro..." className={`w-full mt-1 ${inputCls}`} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Disponibilité</span><input type="date" value={form.availability_date} onChange={e => setForm({ ...form, availability_date: e.target.value })} className={`w-full mt-1 ${inputCls}`} /></label>
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Expiration</span><input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })} className={`w-full mt-1 ${inputCls}`} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Durée du contrat</span><input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Ex: 3 ans" className={`w-full mt-1 ${inputCls}`} /></label>
            <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Salaire</span><input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="Ex: À négocier" className={`w-full mt-1 ${inputCls}`} /></label>
          </div>
          <label className="block"><span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Avantages (séparés par des virgules)</span><input value={form.benefits} onChange={e => setForm({ ...form, benefits: e.target.value })} placeholder="Ex: Logement, Véhicule, Assurance" className={`w-full mt-1 ${inputCls}`} /></label>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Enregistrer</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"><X className="w-4 h-4" /> Annuler</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
