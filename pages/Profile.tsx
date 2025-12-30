
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
        <p className="text-gray-500 mt-1">Informações cadastrais e permissões atribuídas.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="fab-blue h-32 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white flex items-center justify-center overflow-hidden">
             <div className="w-full h-full bg-blue-50 flex items-center justify-center text-4xl">
               👤
             </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.rank} {user.warName}</h2>
              <p className="text-gray-500 font-medium">{user.email}</p>
            </div>
            <span className="px-4 py-1.5 bg-blue-50 text-fab-blue font-bold rounded-full text-xs uppercase tracking-wider border border-blue-100">
              {user.role}
            </span>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Informações Militares</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Nome de Guerra</p>
                  <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{user.warName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Posto / Graduação</p>
                  <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{user.rank}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Comando Militar</p>
                  <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{user.command}</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Acesso e Permissões</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Nível de Acesso</p>
                  <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{user.role}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Permissões Específicas</p>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.length > 0 ? (
                      user.permissions.map(p => (
                        <span key={p} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-100">
                          {p.replace('_', ' ')}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm italic">Nenhuma permissão específica atribuída.</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Membro desde</p>
                  <p className="text-gray-700 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
