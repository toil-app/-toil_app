import { BaseEntity } from './BaseEntity';

export enum UserRole {
  CLIENT = 'USER',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export interface User extends BaseEntity {
  uid: string; // Firebase Auth UID
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  email?: string;
  callingCode: string;
  localPhoneNumber: string;
  profilePhoto?: string;
  role: UserRole.CLIENT;
  status: UserStatus;
  nationality?: string;
  dateOfBirth?: string;
  verificationDetails?: {
    phoneVerified: boolean;
    emailVerified: boolean;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  lastLogin?: any;
}

export interface ServiceProvider extends BaseEntity {
  uid: string; // Firebase Auth UID
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  email: string | null; // Changed to string | null
  displayName: string | null; // Added for FirestoreUser compatibility
  photoURL: string | null; // Added for FirestoreUser compatibility
  profilePhoto?: string;
  role: UserRole.PROVIDER;
  status: UserStatus;
  nationality?: string;
  idNumber?: string;
  dateOfBirth?: string;
  emailVerified: boolean; // Added for FirestoreUser compatibility
  verificationDetails?: {
    phoneVerified: boolean;
    emailVerified: boolean;
    documentsVerified: boolean;
  };
  documents?: {
    frontId?: string;
    backId?: string;
    birthCertificate?: string;
    addressProof?: string;
  };
  qualifications?: {
    yearsOfExperience: number;
    certificates?: string[];
    details?: string;
  };
  teamSettings?: {
    mode: 'individual' | 'group';
    teamSize?: number;
    members?: string[];
  };
  services?: {
    categoryId: string;
    subCategories: string[];
  }[];
  rating?: number;
  reviewsCount?: number;
  lastLogin?: any;
}
