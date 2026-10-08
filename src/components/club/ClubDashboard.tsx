import { useState, useEffect } from 'react';
import { Briefcase, Users, Eye, Star, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { Club, JobPosting, MatchResult, Profile, AthleteProfile } from '../../types';
import { Spinner, EmptyState } from '../ui/States';

interface ClubDashboardProps {
  darkMode: boolean;
}

export default function ClubDashboard({ darkMode }: ClubDashboardProps) {
  const { user, profile } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [athletes, setAthletes] = useState<Record<string, { profile: Profile; athlete: AthleteProfile }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data: clubData } = await supabase.from('clubs').select('*').eq('user_id', user!.id).maybeSingle();
    setClub(clubData as Club | null);

    if (clubData) {
      const { data: postData } = await supabase.from('job_postings').select('*').eq('club_id', clubData.id).order('created_at', { ascending: false });
      setPostings((postData as JobPosting[]) || []);

      const { data: matchData } = await supabase.from('matches').select('*').eq('job_posting_id', 'any').order('created_at', { ascending: false }).limit(10);
      // Get matches for this club's postings
      if (postData && postData.length > 0) {
        const postingIds = postData.map(p => p.id);
        const { data: md } = await supabase.from('matches').select('*').in('job_posting_id', postingIds).order('created_at', { ascending: false }).limit(10);
        setMatches((md as MatchResult[]) || []);

        // Load athlete profiles for matches
        if (md && md.length > 0) {
          const athleteIds = [...new Set(md.map(m => m.athlete_id))];
          const { data: profData } = await supabase.from('profiles').select('*').in('id', athleteIds);
          const { data: athData } = await supabase.from('athlete_profiles').select('*').in('user_id', athleteIds);
          const map: Record<string, { profile: Profile; athlete: AthleteProfile }> = {};
          (profData || []).forEach((p: Profile) => {
            const ath = (athData || []).find((a: AthleteProfile) => a.user_id === p.id);
            if (ath) map[p.id] = { profile: p, athlete: ath };
          });
          setAthletes(map);
        }
      }
    }
    setLoading(false);
  };

  if (loading) return <Spinner />;

  if (!club) {
    return (
      <div className="space-y-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tableau de Bord Club</h1>
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <EmptyState icon={Briefcase} message="Profil club non configuré. Rendez-vous dans « Profil Club » pour le créer." darkMode={darkMode} />
        </div>
      </div>
    );
  }

  const activePostings = postings.filter(p => p.status === 'active');
  const totalViews = postings.reduce((a, p) => a + p.views, 0);
  const totalApplications = postings.reduce((a, p) => a + p.applications, 0);
  const avgScore = matches.length > 0 ? Math.round(matches.reduce((a, m) => a + m.score, 0) / matches.length) : 0;

  const stats = [
    { label: 'Offres actives', value: activePostings.length.toString(), icon: Briefcase, color: 'text-blue-600' },
    { label: 'Vues totales', value: totalViews.toString(), icon: Eye, color: 'text-green-600' },
    { label: 'Candidatures', value: totalApplications.toString(), icon: Users, color: 'text-orange-600' },
    { label: 'Score moyen', value: `${avgScore}%`, icon: Star, color: 'text-cyan-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tableau de Bord Club</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Bienvenue {club.name} - Gestion de vos recrutements</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => {
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

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Candidats Récents</h2>
        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.slice(0, 5).map((match) => {
              const athleteInfo = athletes[match.athlete_id];
              return (
                <div key={match.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(athleteInfo?.profile.first_name || 'A').charAt(0)}
                    </div>
                    <div>
                      <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {athleteInfo ? `${athleteInfo.profile.first_name} ${athleteInfo.profile.last_name}` : 'Candidat'}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{new Date(match.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${match.score >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : match.score >= 70 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>{match.score}%</span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Users} message="Aucun candidat pour le moment" darkMode={darkMode} />
        )}
      </div>

      <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Offres Actives</h2>
        {activePostings.length > 0 ? (
          <div className="space-y-4">
            {activePostings.map((posting) => (
              <div key={posting.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${posting.type === 'recruitment' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : posting.type === 'trial' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                      {posting.type === 'recruitment' ? 'Recrutement' : posting.type === 'trial' ? 'Essai' : posting.type === 'loan' ? 'Prêt' : 'Temporaire'}
                    </span>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1"><Eye className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{posting.views}</span></div>
                    <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-500" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{posting.applications}</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Poste</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.position}</span></div>
                  <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Niveau</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.requirements.level || 'N/A'}</span></div>
                  <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disponibilité</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.availability_date ? new Date(posting.availability_date).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
                  <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expire le</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{posting.expiry_date ? new Date(posting.expiry_date).toLocaleDateString('fr-FR') : 'N/A'}</span></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={Briefcase} message="Aucune offre active. Publiez votre première offre !" darkMode={darkMode} />
        )}
      </div>
    </div>
  );
}
