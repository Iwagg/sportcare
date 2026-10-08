import { useState, useEffect } from 'react';
import { TrendingUp, Target, Calendar, Trophy, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Performance, Goal, Event, ProgressAxis } from '../types';
import { Spinner, EmptyState } from './ui/States';

interface DashboardProps {
  darkMode: boolean;
}

export default function Dashboard({ darkMode }: DashboardProps) {
  const { user } = useAuth();
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [axes, setAxes] = useState<ProgressAxis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    const [perfRes, goalsRes, eventsRes, axesRes] = await Promise.all([
      supabase.from('performances').select('*').eq('user_id', user!.id).order('date', { ascending: false }),
      supabase.from('goals').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
      supabase.from('events').select('*').eq('user_id', user!.id).order('date', { ascending: true }),
      supabase.from('progress_axes').select('*').eq('user_id', user!.id),
    ]);

    setPerformances((perfRes.data as Performance[]) || []);
    setGoals((goalsRes.data as Goal[]) || []);
    setEvents((eventsRes.data as Event[]) || []);
    setAxes((axesRes.data as ProgressAxis[]) || []);
    setLoading(false);
  };

  if (loading) return <Spinner />;

  const latestPerformance = performances[0];
  const activeGoals = goals.filter(g => g.status === 'in-progress').length;
  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
  const avgRating = performances.length > 0
    ? performances.reduce((acc, p) => acc + p.rating, 0) / performances.length
    : 0;

  const stats = [
    { label: 'Note moyenne', value: avgRating.toFixed(1), change: '', icon: Trophy, color: 'text-blue-600' },
    { label: 'Objectifs actifs', value: activeGoals.toString(), change: '', icon: Target, color: 'text-green-600' },
    { label: 'Événements à venir', value: upcomingEvents.length.toString(), change: '', icon: Calendar, color: 'text-orange-600' },
    { label: 'Performances enregistrées', value: performances.length.toString(), change: '', icon: TrendingUp, color: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tableau de Bord</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Vue d'ensemble de vos performances et objectifs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow duration-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Axes de Progression</h2>
        {axes.length === 0 ? (
          <EmptyState icon={Activity} message="Aucun axe de progression. Créez-en depuis l'onglet Progression." darkMode={darkMode} />
        ) : (
          <div className="space-y-4">
            {axes.map((axis) => (
              <div key={axis.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{axis.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{axis.current_level}/10</span>
                    <span className="text-sm text-green-600 font-medium">Cible: {axis.target_level}</span>
                  </div>
                </div>
                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div className="h-2 rounded-full transition-all duration-500" style={{ width: `${(axis.current_level / 10) * 100}%`, backgroundColor: axis.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dernière Performance</h2>
          {latestPerformance ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{latestPerformance.opponent || 'Entraînement'}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${latestPerformance.rating >= 8 ? 'bg-green-100 text-green-800' : latestPerformance.rating >= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{latestPerformance.rating}/10</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                {Object.entries(latestPerformance.stats).map(([key, val]) => (
                  <div key={key}>
                    <span className={`block capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{key}</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState icon={Trophy} message="Aucune performance enregistrée" darkMode={darkMode} />
          )}
        </div>

        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Prochains Événements</h2>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${event.type === 'match' ? 'bg-red-500' : event.type === 'training' ? 'bg-blue-500' : event.type === 'medical' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{event.title}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(event.date).toLocaleDateString('fr-FR')} - {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Calendar} message="Aucun événement à venir" darkMode={darkMode} />
          )}
        </div>
      </div>
    </div>
  );
}

