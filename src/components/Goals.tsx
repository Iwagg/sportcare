import { useState, useEffect } from 'react';
import { Target, TrendingUp, Clock, CheckCircle, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Goal } from '../types';
import { Spinner, EmptyState } from './ui/States';
import Modal from './ui/Modal';

interface GoalsProps {
  darkMode: boolean;
}

const emptyForm = { title: '', description: '', type: 'short' as Goal['type'], target_date: new Date().toISOString().slice(0, 10), progress: 0, status: 'pending' as Goal['status'] };

export default function Goals({ darkMode }: GoalsProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('goals').select('*').eq('user_id', user!.id).order('created_at', { ascending: false });
    setGoals((data as Goal[]) || []);
    setLoading(false);
  };

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (g: Goal) => { setEditId(g.id); setForm({ title: g.title, description: g.description, type: g.type, target_date: g.target_date, progress: g.progress, status: g.status }); setModalOpen(true); };

  const handleSave = async () => {
    const payload = { user_id: user!.id, ...form };
    if (editId) {
      await supabase.from('goals').update(form).eq('id', editId);
    } else {
      await supabase.from('goals').insert(payload);
    }
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet objectif ?')) return;
    await supabase.from('goals').delete().eq('id', id);
    await loadData();
  };

  const updateProgress = async (g: Goal, newProgress: number) => {
    const status = newProgress >= 100 ? 'completed' : newProgress > 0 ? 'in-progress' : 'pending';
    await supabase.from('goals').update({ progress: newProgress, status }).eq('id', g.id);
    await loadData();
  };

  if (loading) return <Spinner />;

  const getStatusColor = (s: string) => ({ completed: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400', 'in-progress': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400', pending: 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400' }[s] || '');
  const getStatusLabel = (s: string) => ({ completed: 'Terminé', 'in-progress': 'En cours', pending: 'En attente' }[s] || '');
  const getTypeLabel = (t: string) => ({ short: 'Court terme', medium: 'Moyen terme', long: 'Long terme' }[t] || '');

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;
  const avgProgress = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Objectifs</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Suivi de vos objectifs à court, moyen et long terme</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel objectif
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Terminés', value: completedGoals, sub: `sur ${goals.length}`, icon: CheckCircle, color: 'text-green-600' },
          { label: 'En cours', value: inProgressGoals, sub: 'objectifs actifs', icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Progression moyenne', value: `${avgProgress}%`, sub: 'tous objectifs', icon: Target, color: 'text-cyan-600' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-3 mb-3"><Icon className={`w-6 h-6 ${s.color}`} /><h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.label}</h3></div>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tous les Objectifs</h2>
        {goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div key={goal.id} className={`p-4 rounded-lg border-l-4 ${goal.type === 'short' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : goal.type === 'medium' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'}`}>
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>{getStatusLabel(goal.status)}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${goal.type === 'short' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : goal.type === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400'}`}>{getTypeLabel(goal.type)}</span>
                    </div>
                    <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{goal.title}</h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{goal.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1 mb-1"><Clock className="w-4 h-4 text-gray-500" /><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(goal.target_date).toLocaleDateString('fr-FR')}</span></div>
                    <div className={`text-2xl font-bold ${goal.progress >= 80 ? 'text-green-600' : goal.progress >= 50 ? 'text-blue-600' : 'text-orange-600'}`}>{goal.progress}%</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="flex items-center gap-3">
                    <input type="range" min="0" max="100" value={goal.progress} onChange={e => updateProgress(goal, +e.target.value)} className="flex-1 accent-blue-600" />
                    <div className={`h-2 w-24 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div className={`h-2 rounded-full ${goal.progress >= 80 ? 'bg-green-500' : goal.progress >= 50 ? 'bg-blue-500' : 'bg-orange-500'}`} style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(goal)} className={`px-3 py-1 text-xs rounded-md ${darkMode ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}><Edit3 className="w-3.5 h-3.5 inline mr-1" />Modifier</button>
                  <button onClick={() => handleDelete(goal.id)} className="px-3 py-1 text-xs rounded-md hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5 inline mr-1" />Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Target} message="Aucun objectif. Cliquez sur « Nouvel objectif » pour commencer." darkMode={darkMode} />
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Modifier l\'objectif' : 'Nouvel objectif'} darkMode={darkMode}>
        <div className="space-y-4">
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Titre</span>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`} />
          </label>
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</span>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</span>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Goal['type'] })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option value="short">Court terme</option><option value="medium">Moyen terme</option><option value="long">Long terme</option>
              </select>
            </label>
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date cible</span>
              <input type="date" value={form.target_date} onChange={e => setForm({ ...form, target_date: e.target.value })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progression: {form.progress}%</span>
              <input type="range" min="0" max="100" value={form.progress} onChange={e => setForm({ ...form, progress: +e.target.value })} className="w-full mt-2 accent-blue-600" />
            </label>
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Statut</span>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Goal['status'] })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option value="pending">En attente</option><option value="in-progress">En cours</option><option value="completed">Terminé</option>
              </select>
            </label>
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
