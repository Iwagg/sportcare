import React, { useState } from 'react';
import { Plus, Eye, Users, Calendar, Edit, Trash2, Pause, Play } from 'lucide-react';
import { mockJobPostings } from '../../data/mockData';

interface JobPostingsProps {
  darkMode: boolean;
}

export default function JobPostings({ darkMode }: JobPostingsProps) {
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'paused':
        return 'En pause';
      case 'closed':
        return 'Fermée';
      case 'expired':
        return 'Expirée';
      default:
        return 'Inconnu';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recruitment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'trial':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'temporary':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'loan':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'recruitment':
        return 'Recrutement';
      case 'trial':
        return 'Essai';
      case 'temporary':
        return 'Temporaire';
      case 'loan':
        return 'Prêt';
      default:
        return 'Autre';
    }
  };

  const filteredPostings = mockJobPostings.filter(posting => 
    filterStatus === 'all' || posting.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Offres d'Emploi
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            Gestion de vos annonces de recrutement
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle offre
        </button>
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-xl border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Filtrer par statut:
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
            <option value="all">Toutes les offres</option>
            <option value="active">Actives</option>
            <option value="paused">En pause</option>
            <option value="closed">Fermées</option>
            <option value="expired">Expirées</option>
          </select>
        </div>
      </div>

      {/* Job Postings List */}
      <div className="space-y-4">
        {filteredPostings.map((posting) => (
          <div
            key={posting.id}
            className={`p-6 rounded-xl border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } hover:shadow-lg transition-shadow duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(posting.status)}`}>
                    {getStatusLabel(posting.status)}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(posting.type)}`}>
                    {getTypeLabel(posting.type)}
                  </span>
                </div>
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {posting.title}
                </h3>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {posting.description}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  <Edit className="w-4 h-4" />
                </button>
                <button className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                }`}>
                  {posting.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'
                }`}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Poste</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {posting.position}
                </span>
              </div>
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Âge requis</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {posting.requirements.ageMin}-{posting.requirements.ageMax} ans
                </span>
              </div>
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Niveau</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {posting.requirements.level}
                </span>
              </div>
              <div>
                <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Disponibilité</span>
                <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(posting.availabilityDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {posting.views} vues
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {posting.applications} candidatures
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Expire le {new Date(posting.expiryDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm">
                  Voir candidats
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
              {mockJobPostings.filter(p => p.status === 'active').length}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Offres actives
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold text-blue-600`}>
              {mockJobPostings.reduce((acc, p) => acc + p.views, 0)}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Vues totales
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold text-orange-600`}>
              {mockJobPostings.reduce((acc, p) => acc + p.applications, 0)}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Candidatures
            </p>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="text-center">
            <p className={`text-2xl font-bold text-purple-600`}>
              {Math.round((mockJobPostings.reduce((acc, p) => acc + p.applications, 0) / mockJobPostings.reduce((acc, p) => acc + p.views, 0)) * 100)}%
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Taux conversion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}