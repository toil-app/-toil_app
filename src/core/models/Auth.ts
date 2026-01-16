import { BaseEntity } from './BaseEntity';
import { UserRole } from './User';

export interface AuthUser {
  uid: string;
  phoneNumber: string | null;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface FirestoreUser extends AuthUser, BaseEntity {
  id: string;
}

export interface PhoneAuthResult {
  confirm: any;
  verificationId: string | null;
}

export interface LoginAction {
  phoneNumber: string;
  userType: UserRole;
}

export interface VerifyOTPAction {
  phoneNumber: string;
  otp: string;
  userType: UserRole;
}

export interface ReSendOTP {
  phoneNumber: string;
}
