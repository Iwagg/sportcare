import React from 'react';
import { TrendingUp, Target, Calendar, Trophy } from 'lucide-react';
import { mockPerformances, mockGoals, mockEvents, mockProgressAxes } from '../data/mockData';

interface DashboardProps {
  darkMode: boolean;
}

export default function Dashboard({ darkMode }: DashboardProps) {
  const latestPerformance = mockPerformances[0];
  const activeGoals = mockGoals.filter(g => g.status === 'in-progress').length;
  const upcomingEvents = mockEvents.filter(e => new Date(e.date) > new Date()).length;
  const avgRating = mockPerformances.reduce((acc, p) => acc + p.rating, 0) / mockPerformances.length;

  const stats = [
    {
      label: 'Note moyenne',
      value: avgRating.toFixed(1),
      change: '+0.3',
      trend: 'up',
      icon: Trophy,
      color: 'text-blue-600'
    },
    {
      label: 'Objectifs actifs',
      value: activeGoals.toString(),
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'text-green-600'
    },
    {
      label: 'Événements à venir',
      value: upcomingEvents.toString(),
      change: '',
      trend: 'neutral',
      icon: Calendar,
      color: 'text-orange-600'
    },
    {
      label: 'Progression globale',
      value: '78%',
      change: '+12%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Tableau de Bord
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Vue d'ensemble de vos performances et objectifs
          </p>
        </div>
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
                {stat.change && (
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                )}
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

      {/* Progress Axes Chart */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Axes de Progression
        </h2>
        <div className="space-y-4">
          {mockProgressAxes.map((axis) => (
            <div key={axis.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {axis.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {axis.currentLevel}/10
                  </span>
                  <span className="text-sm text-green-600 font-medium">
                    Cible: {axis.targetLevel}
                  </span>
                </div>
              </div>
              <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(axis.currentLevel / 10) * 100}%`,
                    backgroundColor: axis.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Performance & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Dernière Performance
          </h2>
          {latestPerformance && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {latestPerformance.opponent || 'Entraînement'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  latestPerformance.rating >= 8 
                    ? 'bg-green-100 text-green-800' 
                    : latestPerformance.rating >= 6 
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {latestPerformance.rating}/10
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Buts</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {latestPerformance.stats.goals}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Passes décisives</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {latestPerformance.stats.assists}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Passes</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {latestPerformance.stats.passes}
                  </span>
                </div>
                <div>
                  <span className={`block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Distance (km)</span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {latestPerformance.stats.distance}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Prochains Événements
          </h2>
          <div className="space-y-3">
            {mockEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  event.type === 'match' ? 'bg-red-500' :
                  event.type === 'training' ? 'bg-blue-500' :
                  event.type === 'medical' ? 'bg-green-500' : 'bg-gray-500'
                }`} />
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
    </div>
  );
}