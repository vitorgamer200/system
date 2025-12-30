
import React from 'react';
import { User, UserRole, Permission } from '../types';

interface SidebarProps {
  user: User;
  currentView: string;
  onViewChange: (view: any) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, currentView, onViewChange, onLogout }) => {
  const hasAdminPermission = user.role !== UserRole.UNASSIGNED && 
    (user.role === UserRole.OWNER || user.role === UserRole.COMGEP || user.role === UserRole.DIRAD || user.role === UserRole.SEFA);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', visible: true },
    { id: 'profile', label: 'Meu Perfil', icon: '👤', visible: true },
    { id: 'reports', label: 'Relatórios', icon: '📄', visible: true },
    { id: 'approvals', label: 'Pendências', icon: '⏳', visible: hasAdminPermission },
    { id: 'users', label: 'Usuários', icon: '👥', visible: hasAdminPermission },
    { id: 'settings', label: 'Configurações', icon: '⚙️', visible: true },
  ];

  return (
    <div className="w-64 fab-blue text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-white/10 flex flex-col items-center">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-3">
          <span className="text-2xl text-fab-blue font-bold">FAB</span>
        </div>
        <h1 className="text-sm font-bold text-center leading-tight">SISTEMA ADMINISTRATIVO</h1>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.filter(item => item.visible).map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full text-left px-6 py-4 flex items-center transition-colors ${
              currentView === item.id ? 'bg-white/10 border-r-4 border-white' : 'hover:bg-white/5'
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="mb-4">
          <p className="text-xs text-white/60">Sessão como:</p>
          <p className="text-sm font-semibold truncate">{user.warName} ({user.rank})</p>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium text-sm"
        >
          Sair do Sistema
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
