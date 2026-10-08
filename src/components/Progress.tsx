import { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, Activity, Plus, Save, Edit3, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { ProgressAxis } from '../types';
import { Spinner, EmptyState } from './ui/States';
import Modal from './ui/Modal';

interface ProgressProps {
  darkMode: boolean;
}

const colors = ['#2563EB', '#059669', '#EA580C', '#0891B2', '#7C2D12', '#9D174D'];
const emptyForm = { name: '', current_level: 5, target_level: 10, color: colors[0], improvements: '' };

export default function Progress({ darkMode }: ProgressProps) {
  const { user } = useAuth();
  const [axes, setAxes] = useState<ProgressAxis[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('progress_axes').select('*').eq('user_id', user!.id);
    setAxes((data as ProgressAxis[]) || []);
    setLoading(false);
  };

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (a: ProgressAxis) => { setEditId(a.id); setForm({ name: a.name, current_level: a.current_level, target_level: a.target_level, color: a.color, improvements: a.improvements.join(', ') }); setModalOpen(true); };

  const handleSave = async () => {
    const improvements = form.improvements.split(',').map(s => s.trim()).filter(Boolean);
    const payload = { user_id: user!.id, name: form.name, current_level: form.current_level, target_level: form.target_level, color: form.color, improvements };
    if (editId) {
      await supabase.from('progress_axes').update({ name: form.name, current_level: form.current_level, target_level: form.target_level, color: form.color, improvements }).eq('id', editId);
    } else {
      await supabase.from('progress_axes').insert(payload);
    }
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet axe de progression ?')) return;
    await supabase.from('progress_axes').delete().eq('id', id);
    await loadData();
  };

  const updateLevel = async (axis: ProgressAxis, newLevel: number) => {
    await supabase.from('progress_axes').update({ current_level: newLevel }).eq('id', axis.id);
    await loadData();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Axes de Progression</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Développement continu de vos compétences techniques et mentales</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel axe
        </button>
      </div>

      {axes.length === 0 ? (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <EmptyState icon={Activity} message="Aucun axe de progression. Créez-en un pour suivre votre développement." darkMode={darkMode} />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {axes.map((axis) => (
              <div key={axis.id} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: axis.color }}>{axis.current_level}</div>
                  <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>{axis.name}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Objectif: {axis.target_level}/10</p>
                  <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min((axis.current_level / axis.target_level) * 100, 100)}%`, backgroundColor: axis.color }} />
                  </div>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{Math.round((axis.current_level / axis.target_level) * 100)}% de l'objectif</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {axes.map((axis) => (
              <div key={axis.id} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: axis.color }}>{axis.name.charAt(0)}</div>
                    <div>
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{axis.name}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Niveau actuel: {axis.current_level}/10 • Objectif: {axis.target_level}/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{axis.current_level}</div>
                      <div className="text-sm text-green-600 font-medium">+{(axis.target_level - axis.current_level).toFixed(1)} visé</div>
                    </div>
                    <button onClick={() => openEdit(axis)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(axis.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Ajuster le niveau: {axis.current_level}/10</label>
                  <input type="range" min="0" max="10" step="0.1" value={axis.current_level} onChange={e => updateLevel(axis, +e.target.value)} className="w-full mt-2 accent-blue-600" />
                  <div className={`h-3 rounded-full mt-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="h-3 rounded-full transition-all duration-500" style={{ width: `${(axis.current_level / 10) * 100}%`, backgroundColor: axis.color }} />
                  </div>
                </div>

                {axis.improvements.length > 0 && (
                  <div>
                    <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Points d'amélioration prioritaires:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {axis.improvements.map((imp, i) => (
                        <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: axis.color }} />
                            <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{imp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Résumé de Progression</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Niveaux actuels</h3>
                <div className="space-y-3">
                  {axes.map((axis) => (
                    <div key={axis.id} className="flex items-center justify-between">
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{axis.name}</span>
                      <span className="font-medium" style={{ color: axis.color }}>{axis.current_level}/10</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Objectifs visés</h3>
                <div className="space-y-3">
                  {axes.map((axis) => (
                    <div key={axis.id} className="flex items-center gap-2">
                      <Target className="w-4 h-4" style={{ color: axis.color }} />
                      <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{axis.name}: {axis.target_level}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Modifier l\'axe' : 'Nouvel axe de progression'} darkMode={darkMode}>
        <div className="space-y-4">
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nom</span>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Technique, Physique..." className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Niveau actuel: {form.current_level}</span>
              <input type="range" min="0" max="10" step="0.1" value={form.current_level} onChange={e => setForm({ ...form, current_level: +e.target.value })} className="w-full mt-2 accent-blue-600" />
            </label>
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Objectif: {form.target_level}</span>
              <input type="range" min="0" max="10" step="0.1" value={form.target_level} onChange={e => setForm({ ...form, target_level: +e.target.value })} className="w-full mt-2 accent-blue-600" />
            </label>
          </div>
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Couleur</span>
            <div className="flex gap-2 mt-2">
              {colors.map(c => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </label>
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Points d'amélioration (séparés par des virgules)</span>
            <input value={form.improvements} onChange={e => setForm({ ...form, improvements: e.target.value })} placeholder="Ex: Précision, Endurance, Vitesse" className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`} />
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Enregistrer</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">Annuler</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
