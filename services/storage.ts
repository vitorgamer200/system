
import { User, Report, AuditLog, UserRole, UserStatus, Rank, Permission } from '../types';

const USERS_KEY = 'fab_users';
const REPORTS_KEY = 'fab_reports';
const LOGS_KEY = 'fab_logs';
const CURRENT_USER_KEY = 'fab_current_user';

const INITIAL_USERS: User[] = [
  {
    id: '1',
    email: 'comandante@fab.mil.br',
    warName: 'SANTOS',
    rank: Rank.TENENTE_BRIGADEIRO,
    command: 'COMGEP',
    role: UserRole.OWNER,
    status: UserStatus.APPROVED,
    permissions: Object.values(Permission),
    createdAt: Date.now() - 1000000
  },
  {
    id: '2',
    email: 'major.silva@fab.mil.br',
    warName: 'SILVA',
    rank: Rank.MAJOR,
    command: 'SEFA',
    role: UserRole.SEFA,
    status: UserStatus.APPROVED,
    permissions: [Permission.GENERATE_REPORTS, Permission.VIEW_PATD],
    createdAt: Date.now() - 500000
  },
  {
    id: 'owner-vitor',
    email: 'andradevitordasilva@gmail.com',
    warName: 'ANDRADE',
    rank: Rank.TENENTE_CORONEL,
    command: 'COMGEP',
    role: UserRole.OWNER,
    status: UserStatus.APPROVED,
    permissions: Object.values(Permission),
    createdAt: Date.now() - 500
  }
];

export const StorageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    let users: User[] = data ? JSON.parse(data) : [...INITIAL_USERS];
    
    const ownerEmail = 'andradevitordasilva@gmail.com'.toLowerCase();
    const ownerIndex = users.findIndex(u => u.email.toLowerCase() === ownerEmail);
    
    let needsSave = false;
    
    if (ownerIndex === -1) {
      const vitor = INITIAL_USERS.find(u => u.email.toLowerCase() === ownerEmail);
      if (vitor) {
        users.push(vitor);
        needsSave = true;
      }
    } else {
      // Garantir que o status e permissões estejam sempre corretos para o owner
      const currentOwner = users[ownerIndex];
      if (currentOwner.status !== UserStatus.APPROVED || currentOwner.role !== UserRole.OWNER) {
        users[ownerIndex] = {
          ...currentOwner,
          role: UserRole.OWNER,
          status: UserStatus.APPROVED,
          permissions: Object.values(Permission)
        };
        needsSave = true;
      }
    }
    
    if (needsSave || !data) {
      StorageService.saveUsers(users);
    }
    
    return users;
  },
  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getReports: (): Report[] => {
    const data = localStorage.getItem(REPORTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveReports: (reports: Report[]) => {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
  },
  getLogs: (): AuditLog[] => {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addLog: (log: Omit<AuditLog, 'id'>) => {
    const logs = StorageService.getLogs();
    const newLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
    localStorage.setItem(LOGS_KEY, JSON.stringify([newLog, ...logs]));
  },
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }
};
