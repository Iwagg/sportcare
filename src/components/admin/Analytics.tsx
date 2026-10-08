import { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, TrendingUp, Activity, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Spinner } from '../ui/States';

interface AnalyticsProps {
  darkMode: boolean;
}

export default function Analytics({ darkMode }: AnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalUsers: 0, athletes: 0, clubs: 0, admins: 0,
    totalPostings: 0, activePostings: 0, totalMatches: 0, interestedMatches: 0,
    totalPerformances: 0, totalGoals: 0, totalEvents: 0,
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, postingsRes, matchesRes, perfRes, goalsRes, eventsRes, athRes] = await Promise.all([
      supabase.from('profiles').select('role'),
      supabase.from('job_postings').select('status'),
      supabase.from('matches').select('status'),
      supabase.from('performances').select('*'),
      supabase.from('goals').select('*'),
      supabase.from('events').select('*'),
      supabase.from('athlete_profiles').select('*'),
    ]);

    const users = (usersRes.data as any[]) || [];
    const postings = (postingsRes.data as any[]) || [];
    const matches = (matchesRes.data as any[]) || [];
    const performances = (perfRes.data as any[]) || [];
    const goals = (goalsRes.data as any[]) || [];
    const events = (eventsRes.data as any[]) || [];

    setData({
      totalUsers: users.length,
      athletes: users.filter(u => u.role === 'athlete').length,
      clubs: users.filter(u => u.role === 'club').length,
      admins: users.filter(u => u.role === 'admin').length,
      totalPostings: postings.length,
      activePostings: postings.filter(p => p.status === 'active').length,
      totalMatches: matches.length,
      interestedMatches: matches.filter(m => m.status === 'interested').length,
      totalPerformances: performances.length,
      totalGoals: goals.length,
      totalEvents: events.length,
    });
    setLoading(false);
  };

  if (loading) return <Spinner />;

  const successRate = data.totalMatches > 0 ? Math.round((data.interestedMatches / data.totalMatches) * 100) : 0;

  const cards = [
    { label: 'Utilisateurs totaux', value: data.totalUsers, icon: Users, color: 'text-blue-600', bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-100' },
    { label: 'Athlètes', value: data.athletes, icon: Activity, color: 'text-green-600', bg: darkMode ? 'bg-green-900/30' : 'bg-green-100' },
    { label: 'Clubs', value: data.clubs, icon: Building2, color: 'text-orange-600', bg: darkMode ? 'bg-orange-900/30' : 'bg-orange-100' },
    { label: 'Offres actives', value: data.activePostings, icon: Briefcase, color: 'text-cyan-600', bg: darkMode ? 'bg-cyan-900/30' : 'bg-cyan-100' },
    { label: 'Correspondances', value: data.totalMatches, icon: TrendingUp, color: 'text-purple-600', bg: darkMode ? 'bg-purple-900/30' : 'bg-purple-100' },
    { label: 'Taux de succès', value: `${successRate}%`, icon: Target, color: 'text-green-600', bg: darkMode ? 'bg-green-900/30' : 'bg-green-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analytiques</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Statistiques détaillées de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${c.bg}`}>
                <Icon className={`w-7 h-7 ${c.color}`} />
              </div>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{c.label}</p>
            </div>
          );
        })}
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Répartition des utilisateurs</h2>
        <div className="space-y-4">
          {[
            { label: 'Athlètes', value: data.athletes, total: data.totalUsers, color: 'bg-blue-500' },
            { label: 'Clubs', value: data.clubs, total: data.totalUsers, color: 'bg-green-500' },
            { label: 'Admins', value: data.admins, total: data.totalUsers, color: 'bg-red-500' },
          ].map((row, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{row.label}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{row.value} / {row.total}</span>
              </div>
              <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className={`h-3 rounded-full ${row.color} transition-all duration-500`} style={{ width: `${row.total > 0 ? (row.value / row.total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activité de la plateforme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}><Activity className="w-8 h-8 text-blue-600" /></div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{data.totalPerformances}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Performances enregistrées</p>
          </div>
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}><Target className="w-8 h-8 text-green-600" /></div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{data.totalGoals}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Objectifs créés</p>
          </div>
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}><Briefcase className="w-8 h-8 text-orange-600" /></div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{data.totalEvents}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Événements planifiés</p>
          </div>
        </div>
      </div>
    </div>
  );
}
