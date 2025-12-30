
import React, { useState } from 'react';
import { User, UserRole, Rank, UserStatus } from '../types';
import { StorageService } from '../services/storage';

interface UserManagementProps {
  user: User;
}

const UserManagement: React.FC<UserManagementProps> = ({ user }) => {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.status !== UserStatus.PENDING && (
      u.warName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.command.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleRevoke = (userId: string) => {
    if (userId === user.id) return; // Cannot revoke self
    const updated = users.map(u => u.id === userId ? { ...u, status: UserStatus.REJECTED } : u);
    StorageService.saveUsers(updated);
    setUsers(updated);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestão de Usuários</h1>
        <p className="text-gray-500 mt-1">Controle de acessos e cargos da corporação.</p>
      </header>

      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nome de guerra, e-mail ou comando..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fab-blue transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Militar</th>
              <th className="px-6 py-4">Comando</th>
              <th className="px-6 py-4">Papel</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length > 0 ? filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-fab-blue font-bold mr-3">
                      {u.warName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{u.rank} {u.warName}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                    {u.command}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-gray-600">{u.role}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    u.status === UserStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {u.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button className="text-fab-blue hover:text-blue-800 text-xs font-bold uppercase">Editar</button>
                    {u.id !== user.id && (
                      <button 
                        onClick={() => handleRevoke(u.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold uppercase"
                      >
                        Revogar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center py-20 text-gray-400 italic">
                  Nenhum militar encontrado com os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
