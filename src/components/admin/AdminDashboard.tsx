import { useState, useEffect } from 'react';
import { Users, Building2, Briefcase, TrendingUp, Activity, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Profile, Club, JobPosting, MatchResult } from '../../types';
import { Spinner } from '../ui/States';

interface AdminDashboardProps {
  darkMode: boolean;
}

export default function AdminDashboard({ darkMode }: AdminDashboardProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, clubs: 0, postings: 0, matches: 0, activeUsers: 0, successfulMatches: 0, athletes: 0 });
  const [recentUsers, setRecentUsers] = useState<Profile[]>([]);
  const [recentClubs, setRecentClubs] = useState<Club[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const [usersRes, clubsRes, postingsRes, matchesRes, athletesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('clubs').select('*').order('created_at', { ascending: false }),
      supabase.from('job_postings').select('*'),
      supabase.from('matches').select('*'),
      supabase.from('athlete_profiles').select('*'),
    ]);

    const users = (usersRes.data as Profile[]) || [];
    const clubs = (clubsRes.data as Club[]) || [];
    const postings = (postingsRes.data as JobPosting[]) || [];
    const matches = (matchesRes.data as MatchResult[]) || [];

    setStats({
      users: users.length,
      clubs: clubs.length,
      postings: postings.length,
      matches: matches.length,
      activeUsers: users.length,
      successfulMatches: matches.filter(m => m.status === 'interested').length,
      athletes: (athletesRes.data as any[])?.length || 0,
    });
    setRecentUsers(users.slice(0, 5));
    setRecentClubs(clubs.slice(0, 5));
    setLoading(false);
  };

  if (loading) return <Spinner />;

  const quickStats = [
    { label: 'Utilisateurs totaux', value: stats.users, icon: Users, color: 'text-blue-600' },
    { label: 'Clubs actifs', value: stats.clubs, icon: Building2, color: 'text-green-600' },
    { label: 'Offres publiées', value: stats.postings, icon: Briefcase, color: 'text-orange-600' },
    { label: 'Athlètes', value: stats.athletes, icon: CheckCircle, color: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Administration</h1>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Vue d'ensemble de la plateforme SportCare</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {quickStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
              <div className={`p-2 rounded-lg inline-block mb-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}><Icon className={`w-6 h-6 ${s.color}`} /></div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.value}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Inscriptions récentes</h2>
          {recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {u.role === 'club' ? u.club_name : `${u.first_name} ${u.last_name}`} ({u.role})
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{u.email}</p>
                  </div>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Aucune inscription</p>
          )}
        </div>

        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Clubs récents</h2>
          {recentClubs.length > 0 ? (
            <div className="space-y-3">
              {recentClubs.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{c.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.sport} • {c.country || 'N/A'}</p>
                  </div>
                  {c.is_verified ? <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Vérifié</span> : <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">En attente</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Aucun club</p>
          )}
        </div>
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vue d'ensemble</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}><Activity className="w-8 h-8 text-blue-600" /></div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Utilisateurs</h3>
            <p className={`text-2xl font-bold text-blue-600 mt-1`}>{stats.activeUsers}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total inscrits</p>
          </div>
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}><TrendingUp className="w-8 h-8 text-green-600" /></div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Matchs</h3>
            <p className={`text-2xl font-bold text-green-600 mt-1`}>{stats.matches}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Correspondances</p>
          </div>
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-cyan-900/30' : 'bg-cyan-100'}`}><CheckCircle className="w-8 h-8 text-cyan-600" /></div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Succès</h3>
            <p className={`text-2xl font-bold text-cyan-600 mt-1`}>{stats.successfulMatches}</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Matchs réussis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
