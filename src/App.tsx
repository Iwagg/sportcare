import React from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Performances from './components/Performances';
import Planning from './components/Planning';
import Goals from './components/Goals';
import Progress from './components/Progress';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ClubDashboard from './components/club/ClubDashboard';
import JobPostings from './components/club/JobPostings';
import MatchingResults from './components/club/MatchingResults';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [userRole, setUserRole] = useLocalStorage<'athlete' | 'club' | 'admin'>('userRole', 'athlete');

  const renderContent = () => {
    switch (activeTab) {
      // Athlete tabs
      case 'profile':
        return <Profile darkMode={darkMode} />;
      case 'performances':
        return <Performances darkMode={darkMode} />;
      case 'planning':
        return <Planning darkMode={darkMode} />;
      case 'goals':
        return <Goals darkMode={darkMode} />;
      case 'progress':
        return <Progress darkMode={darkMode} />;
      
      // Club tabs
      case 'club-dashboard':
        return <ClubDashboard darkMode={darkMode} />;
      case 'club-profile':
        return <Profile darkMode={darkMode} />;
      case 'job-postings':
        return <JobPostings darkMode={darkMode} />;
      case 'matches':
        return <MatchingResults darkMode={darkMode} />;
      case 'club-planning':
        return <Planning darkMode={darkMode} />;
      
      // Admin tabs
      case 'admin-dashboard':
        return <AdminDashboard darkMode={darkMode} />;
      case 'user-management':
        return <UserManagement darkMode={darkMode} />;
      case 'club-management':
        return <UserManagement darkMode={darkMode} />;
      case 'job-management':
        return <JobPostings darkMode={darkMode} />;
      case 'analytics':
        return <AdminDashboard darkMode={darkMode} />;
      
      default:
        return userRole === 'club' ? <ClubDashboard darkMode={darkMode} /> :
               userRole === 'admin' ? <AdminDashboard darkMode={darkMode} /> :
               <Dashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Role Switcher for Demo */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={userRole}
          onChange={(e) => {
            setUserRole(e.target.value as 'athlete' | 'club' | 'admin');
            setActiveTab(e.target.value === 'club' ? 'club-dashboard' : 
                        e.target.value === 'admin' ? 'admin-dashboard' : 'dashboard');
          }}
          className={`px-3 py-1 rounded-lg border text-sm ${
            darkMode 
              ? 'bg-gray-800 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        >
          <option value="athlete">Athlète</option>
          <option value="club">Club</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          userRole={userRole}
        />
        <main className="flex-1 p-8 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;