
import React, { useState, useEffect } from 'react';
import { User, UserStatus, UserRole, Permission, Rank } from '../types';
import { StorageService } from '../services/storage';

interface PendingApprovalsProps {
  user: User;
}

const PendingApprovals: React.FC<PendingApprovalsProps> = ({ user }) => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.COMGEP);
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const users = StorageService.getUsers();
    setPendingUsers(users.filter(u => u.status === UserStatus.PENDING));
  }, []);

  const handleApprove = () => {
    if (!selectedUser) return;

    const allUsers = StorageService.getUsers();
    const updatedUsers = allUsers.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          status: UserStatus.APPROVED,
          role: role,
          permissions: permissions
        };
      }
      return u;
    });

    StorageService.saveUsers(updatedUsers);
    setPendingUsers(updatedUsers.filter(u => u.status === UserStatus.PENDING));
    StorageService.addLog({
      userId: user.id,
      userEmail: user.email,
      timestamp: Date.now(),
      action: 'APPROVE_USER',
      details: `Aprovado acesso para ${selectedUser.email} como ${role}.`
    });
    setSelectedUser(null);
  };

  const handleReject = (targetUser: User) => {
    const allUsers = StorageService.getUsers();
    const updatedUsers = allUsers.map(u => {
      if (u.id === targetUser.id) {
        return { ...u, status: UserStatus.REJECTED };
      }
      return u;
    });

    StorageService.saveUsers(updatedUsers);
    setPendingUsers(updatedUsers.filter(u => u.status === UserStatus.PENDING));
    StorageService.addLog({
      userId: user.id,
      userEmail: user.email,
      timestamp: Date.now(),
      action: 'REJECT_USER',
      details: `Rejeitado acesso para ${targetUser.email}.`
    });
  };

  const togglePermission = (p: Permission) => {
    if (permissions.includes(p)) {
      setPermissions(permissions.filter(perm => perm !== p));
    } else {
      setPermissions([...permissions, p]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Aprovações de Acesso</h1>
        <p className="text-gray-500 mt-1">Gerencie novas solicitações de cadastro no sistema.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {pendingUsers.length > 0 ? pendingUsers.map(u => (
            <div key={u.id} className={`bg-white p-6 rounded-xl border-2 transition-all cursor-pointer ${
              selectedUser?.id === u.id ? 'border-fab-blue shadow-lg' : 'border-gray-100 shadow-sm hover:border-gray-200'
            }`} onClick={() => setSelectedUser(u)}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{u.rank} {u.warName}</h3>
                  <p className="text-sm text-gray-500">{u.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Comando: <span className="font-bold">{u.command}</span></p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedUser(u); }}
                    className="px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200 hover:bg-green-100"
                  >
                    Configurar Acesso
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleReject(u); }}
                    className="px-4 py-1.5 bg-red-50 text-red-700 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="bg-white rounded-2xl p-20 border border-gray-100 text-center text-gray-400 italic">
              Não há solicitações pendentes no momento.
            </div>
          )}
        </div>

        <div>
          <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-8 transition-opacity ${
            !selectedUser ? 'opacity-50 pointer-events-none' : 'opacity-100'
          }`}>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Configurar Permissões</h2>
            {selectedUser && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Papel Organizacional</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg font-medium text-gray-700"
                  >
                    <option value={UserRole.COMGEP}>COMGEP (Pessoal)</option>
                    {/* Fixed invalid function-like call on UserRole enum */}
                    <option value={UserRole.SEFA}>SEFA (Economia)</option>
                    {/* Fixed invalid function-like call on UserRole enum */}
                    <option value={UserRole.DIRAD}>DIRAD (Admin)</option>
                    <option value={UserRole.OWNER}>Administrador Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Habilidades Granulares</label>
                  <div className="space-y-2">
                    {Object.values(Permission).map(p => (
                      <label key={p} className="flex items-center p-3 rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded text-fab-blue border-gray-300 focus:ring-fab-blue"
                          checked={permissions.includes(p)}
                          onChange={() => togglePermission(p)}
                        />
                        <span className="ml-3 text-sm font-medium text-gray-700">{p.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <button 
                    onClick={handleApprove}
                    className="w-full fab-blue text-white py-3 rounded-xl font-bold shadow-lg hover:fab-blue-light transition-all"
                  >
                    Aprovar e Ativar Acesso
                  </button>
                  <p className="text-[10px] text-gray-400 text-center italic">
                    Ao aprovar, o usuário receberá acesso imediato com as permissões acima.
                  </p>
                </div>
              </div>
            )}
            {!selectedUser && (
              <div className="text-center py-20 text-gray-400">
                Selecione uma solicitação para configurar.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovals;
