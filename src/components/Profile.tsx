import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Trophy, TrendingUp, Save, Edit3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { AthleteProfile, Performance } from '../types';
import { Spinner, EmptyState } from './ui/States';

interface ProfileProps {
  darkMode: boolean;
}

export default function Profile({ darkMode }: ProfileProps) {
  const { user, profile } = useAuth();
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfile | null>(null);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AthleteProfile>>({});

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [apRes, perfRes] = await Promise.all([
      supabase.from('athlete_profiles').select('*').eq('user_id', user!.id).maybeSingle(),
      supabase.from('performances').select('*').eq('user_id', user!.id),
    ]);
    setAthleteProfile(apRes.data as AthleteProfile | null);
    setFormData(apRes.data || {});
    setPerformances((perfRes.data as Performance[]) || []);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    if (athleteProfile) {
      await supabase.from('athlete_profiles').update({
        age: formData.age,
        height: formData.height,
        weight: formData.weight,
        position: formData.position,
        nationality: formData.nationality,
        sport: formData.sport,
        club: formData.club,
        matches_played: formData.matches_played,
        goals_scored: formData.goals_scored,
        assists_made: formData.assists_made,
      }).eq('id', athleteProfile.id);
    } else {
      await supabase.from('athlete_profiles').insert({
        user_id: user!.id,
        ...formData,
      });
    }
    await loadData();
    setEditing(false);
    setSaving(false);
  };

  if (loading) return <Spinner />;

  const totalGoals = performances.reduce((acc, p) => acc + (p.stats.goals || 0), 0);
  const totalAssists = performances.reduce((acc, p) => acc + (p.stats.assists || 0), 0);
  const avgRating = performances.length > 0 ? (performances.reduce((acc, p) => acc + p.rating, 0) / performances.length).toFixed(1) : '0.0';

  const profileStats = [
    { label: 'Matchs joués', value: (athleteProfile?.matches_played || 0).toString(), icon: Trophy },
    { label: 'Buts marqués', value: totalGoals.toString() || (athleteProfile?.goals_scored || 0).toString(), icon: TrendingUp },
    { label: 'Passes décisives', value: totalAssists.toString() || (athleteProfile?.assists_made || 0).toString(), icon: User },
    { label: 'Note moyenne', value: avgRating, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Profil Sportif</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Informations personnelles et historique sportif</p>
        </div>
        <button
          onClick={() => editing ? handleSave() : setEditing(true)}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
        >
          {editing ? <><Save className="w-4 h-4" /> {saving ? 'Sauvegarde...' : 'Enregistrer'}</> : <><Edit3 className="w-4 h-4" /> Modifier</>}
        </button>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
              {(profile?.first_name || 'U').charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{profile?.first_name} {profile?.last_name}</h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              {editing ? (
                <input value={formData.position || ''} onChange={e => setFormData({ ...formData, position: e.target.value })} placeholder="Poste" className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              ) : (
                `${athleteProfile?.position || 'Non défini'} • ${athleteProfile?.club || 'Sans club'}`
              )}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                {editing ? (
                  <input type="number" value={formData.age || ''} onChange={e => setFormData({ ...formData, age: +e.target.value })} placeholder="Âge" className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                ) : (
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{athleteProfile?.age || 0} ans</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-500" />
                {editing ? (
                  <input value={formData.nationality || ''} onChange={e => setFormData({ ...formData, nationality: e.target.value })} placeholder="Nationalité" className="px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                ) : (
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{athleteProfile?.nationality || 'Non défini'}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4 text-blue-500" />
                {editing ? (
                  <span className="flex gap-1">
                    <input type="number" value={formData.height || ''} onChange={e => setFormData({ ...formData, height: +e.target.value })} placeholder="cm" className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                    <input type="number" value={formData.weight || ''} onChange={e => setFormData({ ...formData, weight: +e.target.value })} placeholder="kg" className="w-16 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
                  </span>
                ) : (
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{athleteProfile?.height || 0}cm • {athleteProfile?.weight || 0}kg</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {profileStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
              <div className="p-2 rounded-lg mb-4 inline-block ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Carrière</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="block">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Matchs joués</span>
              <input type="number" value={formData.matches_played || 0} onChange={e => setFormData({ ...formData, matches_played: +e.target.value })} className="w-full px-3 py-2 mt-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </label>
            <label className="block">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buts carrière</span>
              <input type="number" value={formData.goals_scored || 0} onChange={e => setFormData({ ...formData, goals_scored: +e.target.value })} className="w-full px-3 py-2 mt-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </label>
            <label className="block">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Passes décisives</span>
              <input type="number" value={formData.assists_made || 0} onChange={e => setFormData({ ...formData, assists_made: +e.target.value })} className="w-full px-3 py-2 mt-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </label>
            <label className="block">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Club actuel</span>
              <input value={formData.club || ''} onChange={e => setFormData({ ...formData, club: e.target.value })} className="w-full px-3 py-2 mt-1 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </label>
          </div>
        </div>
      )}

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Historique des Performances</h2>
        {performances.length > 0 ? (
          <div className="space-y-3">
            {performances.slice(0, 10).map((p) => (
              <div key={p.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.match_type === 'match' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {p.match_type === 'match' ? 'Match' : 'Entraînement'}
                    </span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.opponent || 'Entraînement'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(p.date).toLocaleDateString('fr-FR')}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${p.rating >= 8 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : p.rating >= 6 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>{p.rating}/10</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                  {Object.entries(p.stats).map(([key, val]) => (
                    <div key={key}>
                      <span className={`block capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{key}</span>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Trophy} message="Aucune performance enregistrée. Ajoutez-en depuis l'onglet Performances." darkMode={darkMode} />
        )}
      </div>
    </div>
  );
}
