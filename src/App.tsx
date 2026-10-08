import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Performances from './components/Performances';
import Planning from './components/Planning';
import Goals from './components/Goals';
import Progress from './components/Progress';
import AdminDashboard from './components/admin/AdminDashboard';
import UserManagement from './components/admin/UserManagement';
import ClubManagement from './components/admin/ClubManagement';
import Analytics from './components/admin/Analytics';
import ClubDashboard from './components/club/ClubDashboard';
import ClubProfile from './components/club/ClubProfile';
import JobPostings from './components/club/JobPostings';
import MatchingResults from './components/club/MatchingResults';
import AuthScreen from './components/AuthScreen';
import { useAuth } from './context/AuthContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Spinner } from './components/ui/States';

function App() {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'dashboard');
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    if (profile) {
      const roleDefaults: Record<string, string> = {
        athlete: 'dashboard',
        club: 'club-dashboard',
        admin: 'admin-dashboard',
      };
      const validTabs = getValidTabs(profile.role);
      if (!validTabs.includes(activeTab)) {
        setActiveTab(roleDefaults[profile.role] || 'dashboard');
      }
    }
  }, [profile]);

  if (loading) {
    return (
      <div className={darkMode ? 'dark bg-gray-900 min-h-screen' : 'bg-gray-50 min-h-screen'}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !profile) {
    return <AuthScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
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

      case 'club-dashboard':
        return <ClubDashboard darkMode={darkMode} />;
      case 'club-profile':
        return <ClubProfile darkMode={darkMode} />;
      case 'job-postings':
        return <JobPostings darkMode={darkMode} />;
      case 'matches':
        return <MatchingResults darkMode={darkMode} />;
      case 'club-planning':
        return <Planning darkMode={darkMode} />;

      case 'admin-dashboard':
        return <AdminDashboard darkMode={darkMode} />;
      case 'user-management':
        return <UserManagement darkMode={darkMode} />;
      case 'club-management':
        return <ClubManagement darkMode={darkMode} />;
      case 'job-management':
        return <JobPostings darkMode={darkMode} />;
      case 'analytics':
        return <Analytics darkMode={darkMode} />;

      default:
        return profile.role === 'club' ? <ClubDashboard darkMode={darkMode} /> :
               profile.role === 'admin' ? <AdminDashboard darkMode={darkMode} /> :
               <Dashboard darkMode={darkMode} />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          userRole={profile.role}
        />
        <main className="flex-1 p-4 md:p-8 overflow-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function getValidTabs(role: string): string[] {
  switch (role) {
    case 'club':
      return ['club-dashboard', 'club-profile', 'job-postings', 'matches', 'club-planning'];
    case 'admin':
      return ['admin-dashboard', 'user-management', 'club-management', 'job-management', 'analytics'];
    default:
      return ['dashboard', 'profile', 'performances', 'planning', 'goals', 'progress'];
  }
}

export default App;
