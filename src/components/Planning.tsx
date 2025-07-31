import React from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { mockEvents } from '../data/mockData';

interface PlanningProps {
  darkMode: boolean;
}

export default function Planning({ darkMode }: PlanningProps) {
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'match':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'training':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'medical':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      case 'meeting':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'match':
        return 'Match';
      case 'training':
        return 'Entraînement';
      case 'medical':
        return 'Médical';
      case 'meeting':
        return 'Réunion';
      default:
        return 'Autre';
    }
  };

  const upcomingEvents = mockEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = mockEvents
    .filter(event => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Planning
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Agenda complet de vos activités sportives et rendez-vous
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Ajouter un événement
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Matchs</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {mockEvents.filter(e => e.type === 'match').length}
          </p>
        </div>
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Entraînements</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {mockEvents.filter(e => e.type === 'training').length}
          </p>
        </div>
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Médical</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {mockEvents.filter(e => e.type === 'medical').length}
          </p>
        </div>
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Réunions</span>
          </div>
          <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {mockEvents.filter(e => e.type === 'meeting').length}
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Événements à Venir
        </h2>
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className={`p-4 rounded-lg border-l-4 ${getEventTypeColor(event.type)} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        event.type === 'match' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                        event.type === 'training' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                        event.type === 'medical' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {event.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {event.time}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {event.location}
                          </span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button className={`px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Modifier
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Aucun événement à venir
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className={`p-6 rounded-xl border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Événements Passés
          </h2>
          <div className="space-y-3">
            {pastEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                } opacity-75 hover:opacity-100 transition-opacity duration-200`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      event.type === 'match' ? 'bg-red-500' :
                      event.type === 'training' ? 'bg-blue-500' :
                      event.type === 'medical' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {event.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {new Date(event.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}