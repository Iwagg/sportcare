import { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, BarChart, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Performance } from '../types';
import { Spinner, EmptyState } from './ui/States';
import Modal from './ui/Modal';

interface PerformancesProps {
  darkMode: boolean;
}

const emptyForm = { date: new Date().toISOString().slice(0, 10), match_type: 'match' as 'match' | 'training', opponent: '', goals: 0, assists: 0, passes: 0, tackles: 0, distance: 0, rating: 7 };

export default function Performances({ darkMode }: PerformancesProps) {
  const { user } = useAuth();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('performances').select('*').eq('user_id', user!.id).order('date', { ascending: false });
    setPerformances((data as Performance[]) || []);
    setLoading(false);
  };

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (p: Performance) => {
    setEditId(p.id);
    setForm({
      date: p.date, match_type: p.match_type, opponent: p.opponent || '',
      goals: p.stats.goals || 0, assists: p.stats.assists || 0, passes: p.stats.passes || 0,
      tackles: p.stats.tackles || 0, distance: p.stats.distance || 0, rating: p.rating,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      user_id: user!.id, date: form.date, match_type: form.match_type,
      opponent: form.opponent, rating: form.rating,
      stats: { goals: form.goals, assists: form.assists, passes: form.passes, tackles: form.tackles, distance: form.distance },
    };
    if (editId) {
      await supabase.from('performances').update(payload).eq('id', editId);
    } else {
      await supabase.from('performances').insert(payload);
    }
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette performance ?')) return;
    await supabase.from('performances').delete().eq('id', id);
    await loadData();
  };

  if (loading) return <Spinner />;

  const avgRating = performances.length > 0 ? (performances.reduce((a, p) => a + p.rating, 0) / performances.length).toFixed(1) : '0.0';
  const totalGoals = performances.reduce((a, p) => a + (p.stats.goals || 0), 0);
  const totalAssists = performances.reduce((a, p) => a + (p.stats.assists || 0), 0);
  const avgDistance = performances.length > 0 ? (performances.reduce((a, p) => a + (p.stats.distance || 0), 0) / performances.length).toFixed(1) : '0.0';

  const stats = [
    { label: 'Note moyenne', value: avgRating, icon: Award, color: 'text-blue-600' },
    { label: 'Buts marqués', value: totalGoals.toString(), icon: Target, color: 'text-green-600' },
    { label: 'Passes décisives', value: totalAssists.toString(), icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Distance moy. (km)', value: avgDistance, icon: BarChart, color: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performances</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Analyse détaillée de vos statistiques et évolutions</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
              <div className={`p-2 rounded-lg inline-block mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Historique des Performances</h2>
        {performances.length > 0 ? (
          <div className="space-y-4">
            {performances.map((p) => (
              <div key={p.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.match_type === 'match' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>{p.match_type === 'match' ? 'Match' : 'Entraînement'}</span>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.opponent || 'Entraînement'}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(p.date).toLocaleDateString('fr-FR')}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${p.rating >= 8 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : p.rating >= 6 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>{p.rating}/10</span>
                    <button onClick={() => openEdit(p)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-sm">
                  {Object.entries(p.stats).map(([key, val]) => (
                    <div key={key}>
                      <span className={`block capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{key}</span>
                      <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Award} message="Aucune performance enregistrée. Cliquez sur « Ajouter » pour commencer." darkMode={darkMode} />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Modifier la performance' : 'Nouvelle performance'} darkMode={darkMode}>
        <div className="space-y-4">
          <FormField label="Date" darkMode={darkMode}>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass(darkMode)} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Type" darkMode={darkMode}>
              <select value={form.match_type} onChange={e => setForm({ ...form, match_type: e.target.value as 'match' | 'training' })} className={inputClass(darkMode)}>
                <option value="match">Match</option>
                <option value="training">Entraînement</option>
              </select>
            </FormField>
            <FormField label="Adversaire" darkMode={darkMode}>
              <input value={form.opponent} onChange={e => setForm({ ...form, opponent: e.target.value })} placeholder="Nom adversaire" className={inputClass(darkMode)} />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Buts" darkMode={darkMode}><input type="number" value={form.goals} onChange={e => setForm({ ...form, goals: +e.target.value })} className={inputClass(darkMode)} /></FormField>
            <FormField label="Passes D." darkMode={darkMode}><input type="number" value={form.assists} onChange={e => setForm({ ...form, assists: +e.target.value })} className={inputClass(darkMode)} /></FormField>
            <FormField label="Passes" darkMode={darkMode}><input type="number" value={form.passes} onChange={e => setForm({ ...form, passes: +e.target.value })} className={inputClass(darkMode)} /></FormField>
            <FormField label="Tacles" darkMode={darkMode}><input type="number" value={form.tackles} onChange={e => setForm({ ...form, tackles: +e.target.value })} className={inputClass(darkMode)} /></FormField>
            <FormField label="Distance (km)" darkMode={darkMode}><input type="number" step="0.1" value={form.distance} onChange={e => setForm({ ...form, distance: +e.target.value })} className={inputClass(darkMode)} /></FormField>
            <FormField label="Note /10" darkMode={darkMode}><input type="number" step="0.1" min="0" max="10" value={form.rating} onChange={e => setForm({ ...form, rating: +e.target.value })} className={inputClass(darkMode)} /></FormField>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Enregistrer</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"><X className="w-4 h-4" /> Annuler</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FormField({ label, children, darkMode }: { label: string; children: React.ReactNode; darkMode: boolean }) {
  return (
    <label className="block">
      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function inputClass(darkMode: boolean) {
  return `w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
}
