import React from 'react';
import { 
  User, 
  BarChart3, 
  Calendar, 
  Target, 
  Activity, 
  Settings, 
  Trophy,
  Moon,
  Sun,
  Building2,
  Briefcase,
  Shield,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  userRole?: 'athlete' | 'club' | 'admin';
}

const athleteMenuItems = [
  { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'performances', label: 'Performances', icon: Trophy },
  { id: 'planning', label: 'Planning', icon: Calendar },
  { id: 'goals', label: 'Objectifs', icon: Target },
  { id: 'progress', label: 'Progression', icon: Activity },
];

const clubMenuItems = [
  { id: 'club-dashboard', label: 'Tableau de bord', icon: BarChart3 },
  { id: 'club-profile', label: 'Profil Club', icon: Building2 },
  { id: 'job-postings', label: 'Offres publiées', icon: Briefcase },
  { id: 'matches', label: 'Candidats', icon: Users },
  { id: 'club-planning', label: 'Planning', icon: Calendar },
];

const adminMenuItems = [
  { id: 'admin-dashboard', label: 'Administration', icon: Shield },
  { id: 'user-management', label: 'Utilisateurs', icon: Users },
  { id: 'club-management', label: 'Clubs', icon: Building2 },
  { id: 'job-management', label: 'Offres d\'emploi', icon: Briefcase },
  { id: 'analytics', label: 'Analytiques', icon: BarChart3 },
];

export default function Sidebar({ activeTab, onTabChange, darkMode, onToggleDarkMode, userRole = 'athlete' }: SidebarProps) {
  const getMenuItems = () => {
    switch (userRole) {
      case 'club':
        return clubMenuItems;
      case 'admin':
        return adminMenuItems;
      default:
        return athleteMenuItems;
    }
  };

  const getAppTitle = () => {
    switch (userRole) {
      case 'club':
        return 'SportCare Clubs';
      case 'admin':
        return 'SportCare Admin';
      default:
        return 'SportCare Pro';
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`w-64 h-screen ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-colors duration-200`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            userRole === 'admin' 
              ? 'bg-gradient-to-br from-red-500 to-red-600'
              : userRole === 'club'
              ? 'bg-gradient-to-br from-green-500 to-green-600'
              : 'bg-gradient-to-br from-blue-500 to-blue-600'
          }`}>
            {userRole === 'admin' ? (
              <Shield className="w-6 h-6 text-white" />
            ) : userRole === 'club' ? (
              <Building2 className="w-6 h-6 text-white" />
            ) : (
              <Trophy className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {getAppTitle()}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {userRole === 'admin' ? 'Administration' : userRole === 'club' ? 'Gestion Club' : 'Pro Athletes'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? `${
                          userRole === 'admin' 
                            ? 'bg-red-500' 
                            : userRole === 'club'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        } text-white shadow-lg`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggleDarkMode}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">
            {darkMode ? 'Mode clair' : 'Mode sombre'}
          </span>
        </button>
        
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mt-2 ${
          darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
        }`}>
          <Settings className="w-5 h-5" />
          <span className="font-medium">Paramètres</span>
        </button>
      </div>
    </div>
  );
}