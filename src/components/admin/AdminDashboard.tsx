import React from 'react';
import { Users, Building2, Briefcase, TrendingUp, Activity, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { mockAdminStats } from '../../data/mockData';

interface AdminDashboardProps {
  darkMode: boolean;
}

export default function AdminDashboard({ darkMode }: AdminDashboardProps) {
  const stats = mockAdminStats;

  const quickStats = [
    {
      label: 'Utilisateurs totaux',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      label: 'Clubs actifs',
      value: stats.totalClubs.toString(),
      change: '+8%',
      trend: 'up',
      icon: Building2,
      color: 'text-green-600'
    },
    {
      label: 'Offres publiées',
      value: stats.totalJobPostings.toString(),
      change: '+23%',
      trend: 'up',
      icon: Briefcase,
      color: 'text-orange-600'
    },
    {
      label: 'Matchs réalisés',
      value: stats.successfulMatches.toString(),
      change: '+15%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-purple-600'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'user', message: 'Nouvel utilisateur inscrit: Antoine Martin', time: '5 min' },
    { id: 2, type: 'club', message: 'FC Barcelona a publié une nouvelle offre', time: '12 min' },
    { id: 3, type: 'match', message: 'Match réussi: Antoine Martin → FC Lions', time: '1h' },
    { id: 4, type: 'admin', message: 'Validation du club Real Madrid', time: '2h' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: '3 offres expirent dans 24h', priority: 'medium' },
    { id: 2, type: 'info', message: '5 nouveaux clubs en attente de validation', priority: 'low' },
    { id: 3, type: 'error', message: 'Problème de synchronisation détecté', priority: 'high' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Administration
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Vue d'ensemble de la plateforme SportCare
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            stats.platformActivity >= 90 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : stats.platformActivity >= 70
              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            Activité: {stats.platformActivity}%
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
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

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Alertes & Notifications
          </h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border-l-4 ${
                  alert.type === 'error' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : alert.type === 'warning'
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 ${
                    alert.type === 'error' ? 'text-red-600' :
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`} />
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {alert.message}
                  </span>
                  <span className={`ml-auto px-2 py-1 rounded text-xs ${
                    alert.priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      : alert.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {alert.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Activité Récente
          </h2>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'user' ? 'bg-blue-500' :
                  activity.type === 'club' ? 'bg-green-500' :
                  activity.type === 'match' ? 'bg-purple-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {activity.message}
                  </p>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Overview */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Vue d'ensemble de la Plateforme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Utilisateurs Actifs
            </h3>
            <p className={`text-2xl font-bold text-blue-600 mt-1`}>
              {stats.activeUsers}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Connectés cette semaine
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-green-900/30' : 'bg-green-100'
            }`}>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Nouvelles Inscriptions
            </h3>
            <p className={`text-2xl font-bold text-green-600 mt-1`}>
              {stats.newRegistrations}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Cette semaine
            </p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
              darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
            }`}>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Taux de Réussite
            </h3>
            <p className={`text-2xl font-bold text-purple-600 mt-1`}>
              {Math.round((stats.successfulMatches / stats.totalMatches) * 100)}%
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Matchs réussis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}