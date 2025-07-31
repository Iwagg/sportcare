import React from 'react';
import { Briefcase, Users, Eye, TrendingUp, Calendar, Star } from 'lucide-react';
import { mockJobPostings, mockMatchResults, mockClubs } from '../../data/mockData';

interface ClubDashboardProps {
  darkMode: boolean;
}

export default function ClubDashboard({ darkMode }: ClubDashboardProps) {
  const club = mockClubs[0]; // Assuming current club
  const activePostings = mockJobPostings.filter(p => p.status === 'active').length;
  const totalViews = mockJobPostings.reduce((acc, p) => acc + p.views, 0);
  const totalApplications = mockJobPostings.reduce((acc, p) => acc + p.applications, 0);
  const avgMatchScore = mockMatchResults.reduce((acc, m) => acc + m.score, 0) / mockMatchResults.length;

  const stats = [
    {
      label: 'Offres actives',
      value: activePostings.toString(),
      change: '+2',
      trend: 'up',
      icon: Briefcase,
      color: 'text-blue-600'
    },
    {
      label: 'Vues totales',
      value: totalViews.toString(),
      change: '+15%',
      trend: 'up',
      icon: Eye,
      color: 'text-green-600'
    },
    {
      label: 'Candidatures',
      value: totalApplications.toString(),
      change: '+8',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600'
    },
    {
      label: 'Score moyen',
      value: avgMatchScore.toFixed(0) + '%',
      change: '+5%',
      trend: 'up',
      icon: Star,
      color: 'text-purple-600'
    }
  ];

  const recentMatches = mockMatchResults.slice(0, 3);
  const upcomingEvents = [
    { id: 1, title: 'Entretien avec Antoine Martin', date: '2024-01-25', time: '14:00' },
    { id: 2, title: 'Essai technique - Milieu offensif', date: '2024-01-27', time: '10:00' },
    { id: 3, title: 'Réunion équipe recrutement', date: '2024-01-28', time: '16:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Tableau de Bord Club
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Bienvenue {club.name} - Gestion de vos recrutements
          </p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Nouvelle offre
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              } hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium text-green-600">
                  {stat.change}
                </span>
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Matches & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Candidats Récents
          </h2>
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <div key={match.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Candidat #{match.athleteId}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(match.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    match.score >= 90 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : match.score >= 70 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {match.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Événements à Venir
          </h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {event.title}
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(event.date).toLocaleDateString('fr-FR')} - {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Job Postings */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Offres Actives
        </h2>
        <div className="space-y-4">
          {mockJobPostings.filter(p => p.status === 'active').map((posting) => (
            <div
              key={posting.id}
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              } hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    posting.type === 'recruitment' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : posting.type === 'trial'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {posting.type === 'recruitment' ? 'Recrutement' : 
                     posting.type === 'trial' ? 'Essai' : 'Temporaire'}
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {posting.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {posting.views}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {posting.applications}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Poste</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {posting.position}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Âge</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {posting.requirements.ageMin}-{posting.requirements.ageMax} ans
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Niveau</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {posting.requirements.level}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expire le</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {new Date(posting.expiryDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}