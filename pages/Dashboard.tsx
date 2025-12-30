
import React from 'react';
import { User, UserRole, ReportType } from '../types';
import { StorageService } from '../services/storage';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const users = StorageService.getUsers();
  const reports = StorageService.getReports();
  const pendingApprovals = users.filter(u => u.status === 'PENDING').length;
  
  const stats = [
    { label: 'Relatórios Totais', value: reports.length, icon: '📄', color: 'bg-blue-500' },
    { label: 'Aprovações Pendentes', value: pendingApprovals, icon: '⏳', color: 'bg-amber-500' },
    { label: 'Usuários Ativos', value: users.filter(u => u.status === 'APPROVED').length, icon: '👥', color: 'bg-green-500' },
    { label: 'Alertas de Sistema', value: 0, icon: '⚠️', color: 'bg-red-500' },
  ];

  const recentReports = reports.slice(0, 5);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Bem-vindo, {user.rank} {user.warName}</h1>
        <p className="text-gray-500 mt-1">Visão geral do sistema e atividades recentes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-2xl`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Relatórios Recentes</h2>
            <button className="text-fab-blue text-sm font-bold hover:underline">Ver Todos</button>
          </div>
          <div className="p-6">
            {recentReports.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <th className="pb-3">Tipo</th>
                    <th className="pb-3">Assunto</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentReports.map(report => (
                    <tr key={report.id} className="text-sm">
                      <td className="py-4 font-medium text-gray-800">{report.type}</td>
                      <td className="py-4 text-gray-600">{report.subject}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          report.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          report.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {report.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500">{new Date(report.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>Nenhum relatório encontrado.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Acesso Rápido</h2>
          </div>
          <div className="p-4 grid grid-cols-1 gap-2">
            <button className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 group">
              <span className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-md mr-3">➕</span>
              <span className="text-sm font-medium text-gray-700">Novo Relatório</span>
            </button>
            <button className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 group">
              <span className="w-8 h-8 flex items-center justify-center bg-green-50 text-green-600 rounded-md mr-3">👮</span>
              <span className="text-sm font-medium text-gray-700">Abrir PATD</span>
            </button>
            <button className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200 group">
              <span className="w-8 h-8 flex items-center justify-center bg-purple-50 text-purple-600 rounded-md mr-3">📅</span>
              <span className="text-sm font-medium text-gray-700">Relatório Semanal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
