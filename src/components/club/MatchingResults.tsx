import { useState, useEffect } from 'react';
import { Star, TrendingUp, Eye, Heart, Mail, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { MatchResult, Club, JobPosting, Profile, AthleteProfile, Performance } from '../../types';
import { Spinner, EmptyState } from '../ui/States';

interface MatchingResultsProps {
  darkMode: boolean;
}

export default function MatchingResults({ darkMode }: MatchingResultsProps) {
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [athletes, setAthletes] = useState<Record<string, { profile: Profile; athlete: AthleteProfile | null; performances: Performance[] }>>({});
  const [loading, setLoading] = useState(true);
  const [filterScore, setFilterScore] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [autoMatching, setAutoMatching] = useState(false);

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    setLoading(true);
    const { data: clubData } = await supabase.from('clubs').select('*').eq('user_id', user!.id).maybeSingle();
    setClub(clubData as Club | null);

    if (clubData) {
      const { data: postData } = await supabase.from('job_postings').select('*').eq('club_id', clubData.id);
      const postings = (postData as JobPosting[]) || [];

      if (postings.length > 0) {
        const postingIds = postings.map(p => p.id);
        const { data: matchData } = await supabase.from('matches').select('*').in('job_posting_id', postingIds).order('created_at', { ascending: false });
        setMatches((matchData as MatchResult[]) || []);

        if (matchData && matchData.length > 0) {
          const athleteIds = [...new Set(matchData.map(m => m.athlete_id))];
          await loadAthleteData(athleteIds);
        }
      }
    }
    setLoading(false);
  };

  const loadAthleteData = async (athleteIds: string[]) => {
    const { data: profData } = await supabase.from('profiles').select('*').in('id', athleteIds);
    const { data: athData } = await supabase.from('athlete_profiles').select('*').in('user_id', athleteIds);
    const { data: perfData } = await supabase.from('performances').select('*').in('user_id', athleteIds);

    const map: Record<string, { profile: Profile; athlete: AthleteProfile | null; performances: Performance[] }> = {};
    (profData || []).forEach((p: Profile) => {
      const ath = (athData || []).find((a: AthleteProfile) => a.user_id === p.id) || null;
      const perfs = (perfData || []).filter((pe: Performance) => pe.user_id === p.id);
      map[p.id] = { profile: p, athlete: ath, performances: perfs };
    });
    setAthletes(map);
  };

  const runAutoMatching = async () => {
    if (!club) return;
    setAutoMatching(true);

    const { data: postData } = await supabase.from('job_postings').select('*').eq('club_id', club.id).eq('status', 'active');
    const postings = (postData as JobPosting[]) || [];

    const { data: allAthletes } = await supabase.from('profiles').select('*').eq('role', 'athlete');
    const athleteProfiles = (allAthletes as Profile[]) || [];

    const { data: athData } = await supabase.from('athlete_profiles').select('*');
    const athleteDetails = (athData as AthleteProfile[]) || [];

    for (const posting of postings) {
      const existingMatches = matches.filter(m => m.job_posting_id === posting.id);
      const matchedIds = new Set(existingMatches.map(m => m.athlete_id));

      for (const ap of athleteProfiles) {
        if (matchedIds.has(ap.id)) continue;
        const detail = athleteDetails.find(a => a.user_id === ap.id);
        if (!detail) continue;

        const { score, reasons } = calculateMatchScore(posting, detail, ap);
        if (score >= 40) {
          await supabase.from('matches').insert({
            job_posting_id: posting.id, athlete_id: ap.id, score, reasons, status: 'pending',
          });
        }
      }
    }

    await loadData();
    setAutoMatching(false);
  };

  const calculateMatchScore = (posting: JobPosting, athlete: AthleteProfile, profile: Profile) => {
    let score = 0;
    const reasons: string[] = [];

    if (athlete.sport === posting.sport) { score += 20; reasons.push('Sport correspondant'); }
    else { score -= 20; }

    if (posting.requirements.ageMin && posting.requirements.ageMax) {
      if (athlete.age >= posting.requirements.ageMin && athlete.age <= posting.requirements.ageMax) {
        score += 20; reasons.push(`Âge dans la tranche (${posting.requirements.ageMin}-${posting.requirements.ageMax})`);
      }
    }

    if (posting.requirements.nationality && posting.requirements.nationality.length > 0) {
      if (posting.requirements.nationality.includes(athlete.nationality)) {
        score += 15; reasons.push('Nationalité recherchée');
      }
    }

    if (posting.position && athlete.position) {
      if (athlete.position.toLowerCase().includes(posting.position.toLowerCase()) || posting.position.toLowerCase().includes(athlete.position.toLowerCase())) {
        score += 25; reasons.push('Poste correspondant');
      }
    }

    if (athlete.matches_played > 50) { score += 10; reasons.push('Expérience confirmée'); }
    if (athlete.goals_scored > 20) { score += 10; reasons.push('Buts marqués en carrière'); }

    score = Math.min(100, Math.max(0, score));
    return { score, reasons };
  };

  const updateMatchStatus = async (matchId: string, status: MatchResult['status']) => {
    await supabase.from('matches').update({ status }).eq('id', matchId);
    await loadData();
  };

  if (loading) return <Spinner />;

  if (!club) {
    return (
      <div className="space-y-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Candidats Correspondants</h1>
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <EmptyState icon={Star} message="Configurez votre profil club pour accéder au matching." darkMode={darkMode} />
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => score >= 90 ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' : score >= 70 ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' : score >= 50 ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400' : 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  const getStatusColor = (s: string) => ({ contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', interested: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' }[s] || '');
  const getStatusLabel = (s: string) => ({ contacted: 'Contacté', interested: 'Intéressé', rejected: 'Rejeté', pending: 'En attente' }[s] || '');

  const filteredResults = matches.filter(result => {
    const matchesScore = filterScore === 'all' || (filterScore === 'excellent' && result.score >= 90) || (filterScore === 'good' && result.score >= 70 && result.score < 90) || (filterScore === 'average' && result.score >= 50 && result.score < 70) || (filterScore === 'low' && result.score < 50);
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    return matchesScore && matchesStatus;
  });

  const inputCls = `px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-green-500`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Candidats Correspondants</h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>Profils recommandés par notre algorithme de matching</p>
        </div>
        <button onClick={runAutoMatching} disabled={autoMatching} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50">
          <TrendingUp className="w-4 h-4" /> {autoMatching ? 'Matching en cours...' : 'Lancer le matching'}
        </button>
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
          <div className="flex items-center gap-3"><label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Score:</label><select value={filterScore} onChange={e => setFilterScore(e.target.value)} className={inputCls}><option value="all">Tous</option><option value="excellent">Excellent (90%+)</option><option value="good">Bon (70-89%)</option><option value="average">Moyen (50-69%)</option><option value="low">Faible (&lt;50%)</option></select></div>
          <div className="flex items-center gap-3"><label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Statut:</label><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={inputCls}><option value="all">Tous</option><option value="pending">En attente</option><option value="contacted">Contacté</option><option value="interested">Intéressé</option><option value="rejected">Rejeté</option></select></div>
        </div>
      </div>

      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map((result) => {
            const info = athletes[result.athlete_id];
            return (
              <div key={result.id} className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} hover:shadow-lg transition-shadow`}>
                <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-xl font-bold">
                      {(info?.profile.first_name || 'A').charAt(0)}
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{info ? `${info.profile.first_name} ${info.profile.last_name}` : 'Candidat'}</h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{info?.athlete?.position || 'N/A'} • {info?.athlete?.age || '?'} ans • {info?.athlete?.nationality || 'N/A'}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>{getStatusLabel(result.status)}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(result.score)}`}>{result.score}% de correspondance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {result.reasons.length > 0 && (
                  <div className="mb-4">
                    <h4 className={`font-medium mb-2 text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Raisons de la correspondance:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.reasons.map((reason, i) => <span key={i} className={`px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{reason}</span>)}
                    </div>
                  </div>
                )}

                {info?.athlete && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                    <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Club actuel</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{info.athlete.club || 'Sans club'}</span></div>
                    <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taille/Poids</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{info.athlete.height}cm / {info.athlete.weight}kg</span></div>
                    <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Matchs joués</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{info.athlete.matches_played}</span></div>
                    <div><span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buts carrière</span><span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{info.athlete.goals_scored}</span></div>
                  </div>
                )}

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-4 text-sm">
                    {result.score >= 90 && <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Candidat recommandé</span></div>}
                    {info && info.performances.length > 0 && <div className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-green-500" /><span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{info.performances.length} performances</span></div>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {result.status === 'pending' && <button onClick={() => updateMatchStatus(result.id, 'contacted')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"><Mail className="w-4 h-4" /> Contacter</button>}
                    {result.status === 'contacted' && <button onClick={() => updateMatchStatus(result.id, 'interested')} className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm">Marquer intéressé</button>}
                    {result.status !== 'rejected' && <button onClick={() => updateMatchStatus(result.id, 'rejected')} className="px-3 py-1.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm">Rejeter</button>}
                    {result.status === 'rejected' && <button onClick={() => updateMatchStatus(result.id, 'pending')} className="px-3 py-1.5 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 rounded-lg text-sm">Réinitialiser</button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <EmptyState icon={Star} message="Aucun candidat trouvé. Lancez le matching pour découvrir des athlètes correspondant à vos offres." darkMode={darkMode} />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-green-600">{matches.filter(r => r.score >= 90).length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Excellent</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-blue-600">{matches.filter(r => r.status === 'contacted').length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Contactés</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-orange-600">{matches.filter(r => r.status === 'interested').length}</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Intéressés</p></div></div>
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}><div className="text-center"><p className="text-2xl font-bold text-cyan-600">{matches.length > 0 ? Math.round(matches.reduce((a, r) => a + r.score, 0) / matches.length) : 0}%</p><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Score moyen</p></div></div>
      </div>
    </div>
  );
}
