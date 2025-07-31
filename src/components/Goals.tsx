import React from 'react';
import { Target, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { mockGoals } from '../data/mockData';

interface GoalsProps {
  darkMode: boolean;
}

export default function Goals({ darkMode }: GoalsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'pending':
        return 'En attente';
      default:
        return 'Inconnu';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'short':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'medium':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'long':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'short':
        return 'Court terme';
      case 'medium':
        return 'Moyen terme';
      case 'long':
        return 'Long terme';
      default:
        return 'Autre';
    }
  };

  const completedGoals = mockGoals.filter(g => g.status === 'completed').length;
  const inProgressGoals = mockGoals.filter(g => g.status === 'in-progress').length;
  const avgProgress = mockGoals.reduce((acc, g) => acc + g.progress, 0) / mockGoals.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Objectifs
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Suivi de vos objectifs à court, moyen et long terme
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Nouvel objectif
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Objectifs terminés
            </h3>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {completedGoals}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            sur {mockGoals.length} objectifs
          </p>
        </div>

        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              En cours
            </h3>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {inProgressGoals}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            objectifs actifs
          </p>
        </div>

        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-purple-600" />
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Progression moyenne
            </h3>
          </div>
          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {avgProgress.toFixed(0)}%
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            tous objectifs confondus
          </p>
        </div>
      </div>

      {/* Goals List */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tous les Objectifs
        </h2>
        <div className="space-y-4">
          {mockGoals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-lg border-l-4 ${getTypeColor(goal.type)} hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {getStatusLabel(goal.status)}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      goal.type === 'short' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      goal.type === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {getTypeLabel(goal.type)}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {goal.title}
                  </h3>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {goal.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className={`text-2xl font-bold ${
                    goal.progress >= 80 ? 'text-green-600' :
                    goal.progress >= 50 ? 'text-blue-600' :
                    'text-orange-600'
                  }`}>
                    {goal.progress}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      goal.progress >= 80 ? 'bg-green-500' :
                      goal.progress >= 50 ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}>
                  Mettre à jour
                </button>
                <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 text-green-600`}>
            Objectifs Court Terme
          </h3>
          <div className="space-y-2">
            {mockGoals.filter(g => g.type === 'short').map((goal) => (
              <div key={goal.id} className="text-sm">
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {goal.title}
                </span>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goal.progress}% - {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 text-blue-600`}>
            Objectifs Moyen Terme
          </h3>
          <div className="space-y-2">
            {mockGoals.filter(g => g.type === 'medium').map((goal) => (
              <div key={goal.id} className="text-sm">
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {goal.title}
                </span>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goal.progress}% - {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`font-semibold mb-4 text-purple-600`}>
            Objectifs Long Terme
          </h3>
          <div className="space-y-2">
            {mockGoals.filter(g => g.type === 'long').map((goal) => (
              <div key={goal.id} className="text-sm">
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {goal.title}
                </span>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {goal.progress}% - {new Date(goal.targetDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}