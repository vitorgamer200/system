
import React from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storage';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const logs = StorageService.getLogs().slice(0, 15);
  const isOwner = user.role === UserRole.OWNER;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Configurações do Sistema</h1>
        <p className="text-gray-500 mt-1">Gerencie preferências e visualize logs de auditoria.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">🔧</span> Preferências
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">Notificações por E-mail</span>
                <input type="checkbox" className="w-5 h-5 rounded text-fab-blue" defaultChecked />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">Relatórios em PDF Automático</span>
                <input type="checkbox" className="w-5 h-5 rounded text-fab-blue" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">Modo de Alta Segurança</span>
                <input type="checkbox" className="w-5 h-5 rounded text-fab-blue" defaultChecked />
              </label>
            </div>
          </section>

          {isOwner && (
            <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center">
                <span className="mr-2">⚠️</span> Área Crítica
              </h3>
              <div className="space-y-4">
                <button className="w-full text-left p-3 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 text-sm font-bold transition-colors">
                  Exportar Backup Completo
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-red-100 hover:bg-red-50 text-red-600 text-sm font-bold transition-colors">
                  Zerar Logs de Auditoria
                </button>
              </div>
            </section>
          )}
        </div>

        <div className="lg:col-span-2">
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">Trilha de Auditoria</h3>
              <span className="text-[10px] font-bold text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded uppercase">Real-time</span>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action === 'LOGIN' ? 'bg-blue-100 text-blue-700' :
                      log.action === 'REGISTER' ? 'bg-amber-100 text-amber-700' :
                      log.action === 'APPROVE_USER' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {log.action}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug">
                    <span className="font-bold">{log.userEmail}</span>: {log.details}
                  </p>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-400 italic">
                  Nenhum registro de auditoria disponível.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
