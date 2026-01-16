import { BaseEntity } from './BaseEntity';

export enum TeamMemberRole {
  WORKER = 'worker',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

export interface TeamMember extends BaseEntity {
  teamId: string;
  userId: string;
  role: TeamMemberRole;
  status: TeamMemberStatus;
  joinedDate: any;
  invitationToken?: string;
  invitationExpiry?: any;
  internalNotes?: string;
}

export interface Team extends BaseEntity {
  leaderId: string; // Provider's UID
  name: string;
  description?: string;
  size: number;
  isActive: boolean;
  members: TeamMember[];
  logo?: string;
  totalCapacity?: number; // hours per week
}
