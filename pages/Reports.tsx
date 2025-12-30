
import React, { useState, useEffect } from 'react';
import { User, Report, ReportType, Rank, Permission } from '../types';
import { StorageService } from '../services/storage';

interface ReportsProps {
  user: User;
}

const Reports: React.FC<ReportsProps> = ({ user }) => {
  const [reports, setReports] = useState<Report[]>(StorageService.getReports());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ReportType | 'All'>('All');

  const [formData, setFormData] = useState<Partial<Report>>({
    type: ReportType.WEEKLY,
    subject: '',
    personnelName: '',
    personnelRank: Rank.NONE,
    description: '',
    originatingCommand: user.command
  });

  const handleSave = () => {
    if (!formData.subject || !formData.personnelName) return;

    const newReport: Report = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type || ReportType.WEEKLY,
      subject: formData.subject || '',
      personnelName: formData.personnelName || '',
      personnelRank: formData.personnelRank || Rank.NONE,
      originatingCommand: formData.originatingCommand || user.command,
      date: Date.now(),
      status: 'Pending',
      description: formData.description || '',
      attachments: []
    };

    const updated = [newReport, ...reports];
    StorageService.saveReports(updated);
    setReports(updated);
    StorageService.addLog({
      userId: user.id,
      userEmail: user.email,
      timestamp: Date.now(),
      action: 'REPORT_CREATE',
      details: `Novo relatório do tipo ${newReport.type} criado.`
    });
    setIsModalOpen(false);
    setFormData({ type: ReportType.WEEKLY, personnelRank: Rank.NONE, originatingCommand: user.command });
  };

  const filteredReports = activeTab === 'All' ? reports : reports.filter(r => r.type === activeTab);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Central de Relatórios</h1>
          <p className="text-gray-500 mt-1">Gestão de documentos operacionais e administrativos.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="fab-blue text-white px-6 py-3 rounded-lg font-bold shadow-lg hover:fab-blue-light transition-all flex items-center"
        >
          <span className="text-xl mr-2">+</span> Criar Novo Relatório
        </button>
      </header>

      <div className="mb-6 flex space-x-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('All')}
          className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
            activeTab === 'All' ? 'fab-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Todos
        </button>
        {Object.values(ReportType).map(type => (
          <button 
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === type ? 'fab-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Assunto</th>
              <th className="px-6 py-4">Pessoal Envolvido</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReports.length > 0 ? filteredReports.map(report => (
              <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-800 block">{report.type}</span>
                  <span className="text-[10px] text-gray-400 font-medium">{report.originatingCommand}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{report.subject}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {report.personnelRank} <span className="font-bold">{report.personnelName}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    report.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    report.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {report.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">
                  {new Date(report.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-fab-blue hover:text-blue-800 font-bold text-xs uppercase">Visualizar</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center py-20 text-gray-400 italic">
                  Nenhum relatório encontrado para este critério.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <header className="fab-blue p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Criar Novo Relatório</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200">✕</button>
            </header>
            
            <div className="p-8 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Relatório</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as ReportType})}
                    className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg"
                  >
                    {Object.values(ReportType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Assunto / Referência</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Movimentação Interna"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Graduação do Envolvido</label>
                  <select 
                    value={formData.personnelRank}
                    onChange={(e) => setFormData({...formData, personnelRank: e.target.value as Rank})}
                    className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg"
                  >
                    <option value={Rank.NONE}>Selecione...</option>
                    {Object.values(Rank).filter(r => r !== Rank.NONE).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nome de Guerra do Envolvido</label>
                  <input 
                    type="text" 
                    placeholder="Ex: SILVA"
                    value={formData.personnelName}
                    onChange={(e) => setFormData({...formData, personnelName: e.target.value.toUpperCase()})}
                    className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição / Detalhes</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg resize-none"
                  placeholder="Descreva aqui as informações detalhadas do relatório..."
                />
              </div>

              {formData.type === ReportType.PATD && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="text-sm font-bold text-amber-800 mb-2">Campos Específicos PATD</h3>
                  <div className="space-y-3">
                    <input className="w-full p-2 text-sm border border-amber-100 rounded bg-white" placeholder="Etapas Disciplinares" />
                    <textarea className="w-full p-2 text-sm border border-amber-100 rounded bg-white" placeholder="Notas do Investigador" />
                  </div>
                </div>
              )}
            </div>

            <footer className="p-6 border-t border-gray-100 flex justify-end space-x-4 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-gray-500 font-bold hover:text-gray-700"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-2 fab-blue text-white rounded-lg font-bold shadow-md hover:fab-blue-light transition-all"
              >
                Salvar e Submeter
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
