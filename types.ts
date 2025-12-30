
export enum UserRole {
  OWNER = 'OWNER',
  COMGEP = 'COMGEP',
  SEFA = 'SEFA',
  DIRAD = 'DIRAD',
  UNASSIGNED = 'UNASSIGNED'
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum Rank {
  ASPIRANTE = 'Aspirante a Oficial',
  TENENTE_2 = 'Segundo Tenente',
  TENENTE_1 = 'Primeiro Tenente',
  CAPITAO = 'Capitão',
  MAJOR = 'Major',
  TENENTE_CORONEL = 'Tenente Coronel',
  CORONEL = 'Coronel',
  BRIGADEIRO = 'Brigadeiro',
  MAJOR_BRIGADEIRO = 'Major-Brigadeiro',
  TENENTE_BRIGADEIRO = 'Tenente-Brigadeiro',
  NONE = 'Nenhum'
}

export enum Permission {
  APPROVE_USERS = 'APPROVE_USERS',
  EDIT_PROFILES = 'EDIT_PROFILES',
  GENERATE_REPORTS = 'GENERATE_REPORTS',
  VIEW_PATD = 'VIEW_PATD',
  ASSIGN_RANKS = 'ASSIGN_RANKS'
}

export enum ReportType {
  PROMOTION = 'Promoção',
  TRANSFER = 'Transferência',
  EXILE = 'Exílio',
  PATD = 'PATD',
  LEAVE = 'Dispensa',
  WEEKLY = 'Relatório Semanal'
}

export interface User {
  id: string;
  email: string;
  warName: string;
  rank: Rank;
  command: string;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
  createdAt: number;
}

export interface Report {
  id: string;
  type: ReportType;
  subject: string;
  personnelName: string;
  personnelRank: Rank;
  originatingCommand: string;
  date: number;
  status: 'Draft' | 'Pending' | 'Approved' | 'Rejected';
  approver?: string;
  description: string;
  investigatorNotes?: string;
  disciplinarySteps?: string;
  finalDisposition?: string;
  attachments: string[];
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  timestamp: number;
  action: string;
  details: string;
}
