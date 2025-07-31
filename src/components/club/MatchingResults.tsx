import React, { useState } from 'react';
import { Star, User, TrendingUp, Mail, Phone, Eye, Heart } from 'lucide-react';
import { mockMatchResults, mockAthlete } from '../../data/mockData';

interface MatchingResultsProps {
  darkMode: boolean;
}

export default function MatchingResults({ darkMode }: MatchingResultsProps) {
  const [filterScore, setFilterScore] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 70) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'interested':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'contacted':
        return 'Contacté';
      case 'interested':
        return 'Intéressé';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  const filteredResults = mockMatchResults.filter(result => {
    const matchesScore = filterScore === 'all' || 
      (filterScore === 'excellent' && result.score >= 90) ||
      (filterScore === 'good' && result.score >= 70 && result.score < 90) ||
      (filterScore === 'average' && result.score >= 50 && result.score < 70) ||
      (filterScore === 'low' && result.score < 50);
    
    const matchesStatus = filterStatus === 'all' || result.status === filterStatus;
    
    return matchesScore && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Candidats Correspondants
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Profils recommandés par notre algorithme de matching
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3">
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Score de correspondance:
            </label>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="all">Tous les scores</option>
              <option value="excellent">Excellent (90%+)</option>
              <option value="good">Bon (70-89%)</option>
              <option value="average">Moyen (50-69%)</option>
              <option value="low">Faible (&lt;50%)</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Statut:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="contacted">Contacté</option>
              <option value="interested">Intéressé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matching Results */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            className={`p-6 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <img
                  src={mockAthlete.avatar}
                  alt="Athlete"
                  className="w-16 h-16 rounded-full object-cover border-2 border-green-500"
                />
                <div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {mockAthlete.firstName} {mockAthlete.lastName}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mockAthlete.position} • {mockAthlete.age} ans • {mockAthlete.nationality}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>
                      {getStatusLabel(result.status)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(result.score)}`}>
                      {result.score}% de correspondance
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  <Eye className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'
                }`}>
                  <Heart className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                  Contacter
                </button>
              </div>
            </div>

            {/* Match Reasons */}
            <div className="mb-4">
              <h4 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Raisons de la correspondance:
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.reasons.map((reason, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs ${
                      darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {reason}
                  </span>
                ))}
              </div>
            </div>

            {/* Athlete Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Club actuel</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mockAthlete.club}
                </span>
              </div>
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Taille/Poids</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {mockAthlete.height}cm / {mockAthlete.weight}kg
                </span>
              </div>
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Note moyenne</span>
                <span className={`font-semibold text-green-600`}>
                  8.2/10
                </span>
              </div>
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disponibilité</span>
                <span className={`font-semibold text-blue-600`}>
                  Immédiate
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Candidat recommandé
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    En progression
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Voir profil complet
                </button>
                <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}>
                  Programmer entretien
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold text-green-600`}>
              {mockMatchResults.filter(r => r.score >= 90).length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Correspondances excellentes
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold text-blue-600`}>
              {mockMatchResults.filter(r => r.status === 'contacted').length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Candidats contactés
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold text-orange-600`}>
              {mockMatchResults.filter(r => r.status === 'interested').length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Candidats intéressés
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold text-purple-600`}>
              {Math.round(mockMatchResults.reduce((acc, r) => acc + r.score, 0) / mockMatchResults.length)}%
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Score moyen
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}