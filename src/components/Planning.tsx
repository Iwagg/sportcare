import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Event } from '../types';
import { Spinner, EmptyState } from './ui/States';
import Modal from './ui/Modal';

interface PlanningProps {
  darkMode: boolean;
}

const emptyForm = { title: '', type: 'training' as Event['type'], date: new Date().toISOString().slice(0, 10), time: '09:00', location: '', description: '' };

export default function Planning({ darkMode }: PlanningProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await supabase.from('events').select('*').eq('user_id', user!.id).order('date', { ascending: true });
    setEvents((data as Event[]) || []);
    setLoading(false);
  };

  const openCreate = () => { setEditId(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (e: Event) => { setEditId(e.id); setForm({ title: e.title, type: e.type, date: e.date, time: e.time, location: e.location || '', description: e.description || '' }); setModalOpen(true); };

  const handleSave = async () => {
    const payload = { user_id: user!.id, ...form };
    if (editId) {
      await supabase.from('events').update(form).eq('id', editId);
    } else {
      await supabase.from('events').insert(payload);
    }
    setModalOpen(false);
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    await supabase.from('events').delete().eq('id', id);
    await loadData();
  };

  if (loading) return <Spinner />;

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'match': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'training': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'medical': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'meeting': return 'border-orange-500 bg-orange-50 dark:bg-orange-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getEventTypeLabel = (type: string) => ({ match: 'Match', training: 'Entraînement', medical: 'Médical', meeting: 'Réunion' }[type] || 'Autre');

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const pastEvents = events.filter(e => new Date(e.date) < new Date()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Planning</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Agenda complet de vos activités sportives et rendez-vous</p>
        </div>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un événement
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Matchs', count: events.filter(e => e.type === 'match').length, color: 'bg-red-500' },
          { label: 'Entraînements', count: events.filter(e => e.type === 'training').length, color: 'bg-blue-500' },
          { label: 'Médical', count: events.filter(e => e.type === 'medical').length, color: 'bg-green-500' },
          { label: 'Réunions', count: events.filter(e => e.type === 'meeting').length, color: 'bg-orange-500' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${s.color} rounded-full`} />
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.label}</span>
            </div>
            <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.count}</p>
          </div>
        ))}
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Événements à Venir</h2>
        {upcomingEvents.length > 0 ? (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className={`p-4 rounded-lg border-l-4 ${getEventTypeColor(event.type)}`}>
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${event.type === 'match' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : event.type === 'training' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : event.type === 'medical' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>{getEventTypeLabel(event.type)}</span>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1"><Calendar className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{event.time}</span></div>
                      {event.location && <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{event.location}</span></div>}
                    </div>
                    {event.description && <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{event.description}</p>}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => openEdit(event)} className={`px-3 py-1 text-xs rounded-md ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><Edit3 className="w-3.5 h-3.5 inline mr-1" />Modifier</button>
                    <button onClick={() => handleDelete(event.id)} className="px-3 py-1 text-xs rounded-md hover:bg-red-100 text-red-500"><Trash2 className="w-3.5 h-3.5 inline mr-1" />Supprimer</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Calendar} message="Aucun événement à venir" darkMode={darkMode} />
        )}
      </div>

      {pastEvents.length > 0 && (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Événements Passés</h2>
          <div className="space-y-3">
            {pastEvents.slice(0, 10).map((event) => (
              <div key={event.id} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} opacity-75`}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${event.type === 'match' ? 'bg-red-500' : event.type === 'training' ? 'bg-blue-500' : event.type === 'medical' ? 'bg-green-500' : 'bg-orange-500'}`} />
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{event.title}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{event.time}</span>
                    <button onClick={() => handleDelete(event.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Modifier l\'événement' : 'Nouvel événement'} darkMode={darkMode}>
        <div className="space-y-4">
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Titre</span>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500`} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Type</span>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Event['type'] })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                <option value="training">Entraînement</option><option value="match">Match</option><option value="medical">Médical</option><option value="meeting">Réunion</option>
              </select>
            </label>
            <label className="block">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Heure</span>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
            </label>
          </div>
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</span>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
          </label>
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Lieu</span>
            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
          </label>
          <label className="block">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</span>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={`w-full mt-1 px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`} />
          </label>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"><Save className="w-4 h-4" /> Enregistrer</button>
            <button onClick={() => setModalOpen(false)} className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"><X className="w-4 h-4" /> Annuler</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
