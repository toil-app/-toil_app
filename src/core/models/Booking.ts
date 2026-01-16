import { BaseEntity } from './BaseEntity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
}

export interface BookingLocation {
  address: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
}

export interface BookingSchedule {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // in hours
  recurring?: boolean;
  recurrencePattern?: string; // e.g., 'weekly', 'daily'
}

export interface BookingAmount {
  basePrice: number;
  discount?: number;
  tax?: number;
  total: number;
  currency: string; // e.g., 'USD'
}

export interface Booking extends BaseEntity {
  clientId: string;
  providerId: string;
  serviceId: string;
  status: BookingStatus;
  location: BookingLocation;
  schedule: BookingSchedule;
  amount: BookingAmount;
  notes?: string;
  assignedTeamMembers?: string[]; // Provider's team member IDs
  specialRequirements?: string[];
  cancellationReason?: string;
  completedAt?: any;
}

export interface BookingMessage extends BaseEntity {
  bookingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  attachments?: {
    url: string;
    type: string; // 'image', 'document', etc.
  }[];
  isRead: boolean;
}
