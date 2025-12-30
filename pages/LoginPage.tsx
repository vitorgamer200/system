
import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { User, UserStatus, UserRole, Rank } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [warName, setWarName] = useState('');
  const [rank, setRank] = useState<Rank>(Rank.NONE);
  const [command, setCommand] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      setMessage({ text: 'E-mail não cadastrado.', type: 'error' });
    } else if (user.status === UserStatus.PENDING) {
      setMessage({ text: 'Seu acesso está pendente de aprovação pelo administrador.', type: 'info' });
    } else if (user.status === UserStatus.REJECTED) {
      setMessage({ text: 'Seu acesso foi recusado. Entre em contato com a administração.', type: 'error' });
    } else {
      onLogin(user);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !warName || !command || rank === Rank.NONE) {
      setMessage({ text: 'Preencha todos os campos obrigatórios.', type: 'error' });
      return;
    }

    const users = StorageService.getUsers();
    if (users.find(u => u.email === email)) {
      setMessage({ text: 'E-mail já cadastrado.', type: 'error' });
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      warName,
      rank,
      command,
      role: UserRole.UNASSIGNED,
      status: UserStatus.PENDING,
      permissions: [],
      createdAt: Date.now()
    };

    StorageService.saveUsers([...users, newUser]);
    StorageService.addLog({
      userId: newUser.id,
      userEmail: newUser.email,
      timestamp: Date.now(),
      action: 'REGISTER',
      details: `Solicitação de acesso enviada por ${newUser.email}`
    });

    setMessage({ text: 'Solicitação enviada com sucesso! Aguarde a aprovação.', type: 'success' });
    setIsRegistering(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="fab-blue p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-fab-blue font-bold">FAB</span>
          </div>
          <h1 className="text-white text-2xl font-bold uppercase tracking-wide">Força Aérea Brasileira</h1>
          <p className="text-white/80 text-sm mt-2">Sistema Administrativo</p>
          <div className="mt-4 px-4 py-1 bg-white/10 rounded-full inline-block">
            <span className="text-white text-[10px] font-bold tracking-widest uppercase">Acesso Restrito: COMGEP, SEFA, DIRAD</span>
          </div>
        </div>

        <div className="p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg text-sm font-medium border ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
              message.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 
              'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {message.text}
            </div>
          )}

          {!isRegistering ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">E-mail Institucional</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fab-blue focus:border-transparent transition-all"
                  placeholder="exemplo@fab.mil.br"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full fab-blue text-white font-bold py-3 px-4 rounded-lg hover:fab-blue-light transition-all transform active:scale-95 shadow-lg"
              >
                Entrar no Sistema
              </button>
              <div className="mt-6 text-center">
                <p className="text-gray-500 text-sm">
                  Não possui acesso? {' '}
                  <button 
                    type="button"
                    onClick={() => { setIsRegistering(true); setMessage(null); }}
                    className="text-fab-blue font-bold hover:underline"
                  >
                    Solicitar Cadastro
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">Nome de Guerra</label>
                  <input 
                    type="text" 
                    value={warName}
                    onChange={(e) => setWarName(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fab-blue"
                    placeholder="Ex: SANTOS"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">Posto/Graduação</label>
                  <select 
                    value={rank}
                    onChange={(e) => setRank(e.target.value as Rank)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fab-blue"
                  >
                    <option value={Rank.NONE}>Selecione...</option>
                    {Object.values(Rank).filter(r => r !== Rank.NONE).map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">Comando Militar</label>
                  <input 
                    type="text" 
                    value={command}
                    onChange={(e) => setCommand(e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fab-blue"
                    placeholder="Ex: COMGEP"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-1">E-mail</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fab-blue"
                    placeholder="usuario@fab.mil.br"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full fab-blue text-white font-bold py-3 px-4 rounded-lg mt-6 hover:fab-blue-light transition-all shadow-lg"
              >
                Enviar Solicitação
              </button>
              <button 
                type="button"
                onClick={() => { setIsRegistering(false); setMessage(null); }}
                className="w-full mt-2 text-gray-500 font-medium py-2 hover:text-gray-700"
              >
                Voltar ao Início
              </button>
            </form>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Este sistema é de uso exclusivo para pessoal autorizado. <br/>
            O acesso não autorizado constitui crime militar conforme legislação vigente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
