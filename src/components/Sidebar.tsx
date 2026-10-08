import { useState } from 'react';
import {
  User, BarChart3, Calendar, Target, Activity, Settings, Trophy,
  Moon, Sun, Building2, Briefcase, Shield, Users, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  userRole: 'athlete' | 'club' | 'admin';
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

export default function Sidebar({ activeTab, onTabChange, darkMode, onToggleDarkMode, userRole }: SidebarProps) {
  const { profile, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getMenuItems = () => {
    switch (userRole) {
      case 'club': return clubMenuItems;
      case 'admin': return adminMenuItems;
      default: return athleteMenuItems;
    }
  };

  const getAppTitle = () => {
    switch (userRole) {
      case 'club': return 'SportCare Clubs';
      case 'admin': return 'SportCare Admin';
      default: return 'SportCare Pro';
    }
  };

  const menuItems = getMenuItems();
  const accentColor = userRole === 'admin' ? 'bg-red-500' : userRole === 'club' ? 'bg-green-500' : 'bg-blue-500';
  const accentGradient = userRole === 'admin' ? 'from-red-500 to-red-600' : userRole === 'club' ? 'from-green-500 to-green-600' : 'from-blue-500 to-blue-600';
  const accentHover = userRole === 'admin' ? 'hover:bg-red-600' : userRole === 'club' ? 'hover:bg-green-600' : 'hover:bg-blue-600';

  const displayName = profile?.role === 'club'
    ? profile?.club_name || 'Club'
    : `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Utilisateur';

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className={`w-64 h-screen ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col transition-colors duration-200`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${accentGradient} shadow-lg`}>
            {userRole === 'admin' ? <Shield className="w-6 h-6 text-white" /> :
             userRole === 'club' ? <Building2 className="w-6 h-6 text-white" /> :
             <Trophy className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{getAppTitle()}</h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {userRole === 'admin' ? 'Administration' : userRole === 'club' ? 'Gestion Club' : 'Pro Athletes'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? `${accentColor} text-white shadow-lg`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`flex items-center gap-3 px-3 py-2 mb-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${accentGradient} flex-shrink-0`}>
            <span className="text-white text-sm font-bold">{displayName.charAt(0).toUpperCase()}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{displayName}</p>
            <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{profile?.email}</p>
          </div>
        </div>

        <button
          onClick={onToggleDarkMode}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium text-sm">{darkMode ? 'Mode clair' : 'Mode sombre'}</span>
        </button>

        <button
          onClick={() => signOut()}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${darkMode ? 'text-gray-300 hover:bg-red-900/30 hover:text-red-400' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900 shadow-md'}`}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:block flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
