
import React, { useState, useEffect } from 'react';
import { User, UserRole, UserStatus } from './types';
import { StorageService } from './services/storage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import PendingApprovals from './pages/PendingApprovals';
import Settings from './pages/Settings';

type View = 'dashboard' | 'profile' | 'reports' | 'users' | 'approvals' | 'settings';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleLogin = (user: User) => {
    StorageService.setCurrentUser(user);
    setCurrentUser(user);
    StorageService.addLog({
      userId: user.id,
      userEmail: user.email,
      timestamp: Date.now(),
      action: 'LOGIN',
      details: `Usuário ${user.email} efetuou login.`
    });
  };

  const handleLogout = () => {
    if (currentUser) {
      StorageService.addLog({
        userId: currentUser.id,
        userEmail: currentUser.email,
        timestamp: Date.now(),
        action: 'LOGOUT',
        details: `Usuário ${currentUser.email} efetuou logout.`
      });
    }
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard user={currentUser} />;
      case 'profile': return <Profile user={currentUser} />;
      case 'reports': return <Reports user={currentUser} />;
      case 'users': return <UserManagement user={currentUser} />;
      case 'approvals': return <PendingApprovals user={currentUser} />;
      case 'settings': return <Settings user={currentUser} />;
      default: return <Dashboard user={currentUser} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        user={currentUser} 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout} 
      />
      <main className="flex-1 overflow-y-auto p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
