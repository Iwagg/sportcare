import React from 'react';
import { TrendingUp, Target, Award, BarChart } from 'lucide-react';
import { mockPerformances } from '../data/mockData';

interface PerformancesProps {
  darkMode: boolean;
}

export default function Performances({ darkMode }: PerformancesProps) {
  const avgRating = mockPerformances.reduce((acc, p) => acc + p.rating, 0) / mockPerformances.length;
  const totalGoals = mockPerformances.reduce((acc, p) => acc + p.stats.goals, 0);
  const totalAssists = mockPerformances.reduce((acc, p) => acc + p.stats.assists, 0);
  const avgDistance = mockPerformances.reduce((acc, p) => acc + p.stats.distance, 0) / mockPerformances.length;

  const stats = [
    { label: 'Note moyenne', value: avgRating.toFixed(1), icon: Award, color: 'text-blue-600' },
    { label: 'Buts marqués', value: totalGoals.toString(), icon: Target, color: 'text-green-600' },
    { label: 'Passes décisives', value: totalAssists.toString(), icon: TrendingUp, color: 'text-orange-600' },
    { label: 'Distance moy. (km)', value: avgDistance.toFixed(1), icon: BarChart, color: 'text-purple-600' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Performances
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Analyse détaillée de vos statistiques et évolutions
          </p>
        </div>
      </div>

      {/* Performance Stats */}
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

      {/* Performance History */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Historique des Performances
        </h2>
        <div className="space-y-4">
          {mockPerformances.map((performance) => (
            <div
              key={performance.id}
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
              } hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    performance.matchType === 'match' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {performance.matchType === 'match' ? 'Match' : 'Entraînement'}
                  </div>
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {performance.opponent || 'Séance d\'entraînement'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(performance.date).toLocaleDateString('fr-FR')}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    performance.rating >= 8 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : performance.rating >= 6 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {performance.rating}/10
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buts</span>
                  <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {performance.stats.goals}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Passes D.</span>
                  <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {performance.stats.assists}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Passes</span>
                  <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {performance.stats.passes}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tacles</span>
                  <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {performance.stats.tackles}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Distance (km)</span>
                  <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {performance.stats.distance}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Trends */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Tendances de Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Évolution des Notes
            </h3>
            <div className="space-y-2">
              {mockPerformances.map((perf, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className={`text-sm w-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(perf.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className={`flex-1 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                      style={{ width: `${(perf.rating / 10) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-medium w-8 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {perf.rating}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Points Forts
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Précision des passes
                </span>
                <span className="text-green-600 font-medium">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Vitesse de sprint
                </span>
                <span className="text-green-600 font-medium">32.4 km/h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Endurance
                </span>
                <span className="text-green-600 font-medium">11.2 km moy.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}