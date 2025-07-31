import React from 'react';
import { TrendingUp, Target, Award, Activity } from 'lucide-react';
import { mockProgressAxes } from '../data/mockData';

interface ProgressProps {
  darkMode: boolean;
}

export default function Progress({ darkMode }: ProgressProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Axes de Progression
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Développement continu de vos compétences techniques et mentales
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
          <Target className="w-4 h-4" />
          Nouveau programme
        </button>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {mockProgressAxes.map((axis) => (
          <div
            key={axis.id}
            className={`p-6 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: axis.color }}
              >
                {axis.currentLevel}
              </div>
              <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {axis.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
                Objectif: {axis.targetLevel}/10
              </p>
              <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(axis.currentLevel / axis.targetLevel) * 100}%`,
                    backgroundColor: axis.color
                  }}
                />
              </div>
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {((axis.currentLevel / axis.targetLevel) * 100).toFixed(0)}% de l'objectif
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Progress Cards */}
      <div className="space-y-6">
        {mockProgressAxes.map((axis) => (
          <div
            key={axis.id}
            className={`p-6 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: axis.color }}
                >
                  {axis.name.charAt(0)}
                </div>
                <div>
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {axis.name}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Niveau actuel: {axis.currentLevel}/10 • Objectif: {axis.targetLevel}/10
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {axis.currentLevel}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  +{(axis.targetLevel - axis.currentLevel).toFixed(1)} visé
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className={`h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="h-3 rounded-full transition-all duration-500 relative"
                  style={{
                    width: `${(axis.currentLevel / 10) * 100}%`,
                    backgroundColor: axis.color
                  }}
                >
                  {/* Target indicator */}
                  <div
                    className="absolute top-0 w-1 h-3 bg-white border-2 border-gray-800 rounded-full"
                    style={{
                      left: `${((axis.targetLevel - axis.currentLevel) / axis.currentLevel) * 100}%`
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>0</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>10</span>
              </div>
            </div>

            {/* Improvements List */}
            <div>
              <h4 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Points d'amélioration prioritaires:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {axis.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                    } hover:shadow-sm transition-shadow duration-200`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: axis.color }}
                      />
                      <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {improvement}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                className="px-4 py-2 rounded-lg text-white font-medium transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: axis.color }}
              >
                Programme d'entraînement
              </button>
              <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
                Voir détails
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Résumé de Progression
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Évolutions récentes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Technique (30 derniers jours)
                </span>
                <span className="text-green-600 font-medium">+0.3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Physique (30 derniers jours)
                </span>
                <span className="text-green-600 font-medium">+0.2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Mental (30 derniers jours)
                </span>
                <span className="text-blue-600 font-medium">+0.5</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Prochaines étapes
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Programme cardio intensif
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-green-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Séances de précision technique
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Coaching mental personnalisé
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}