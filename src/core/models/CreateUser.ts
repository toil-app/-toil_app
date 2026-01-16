import { UserRole } from './User';

export interface CreateUser {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  callingCode: string;
  localPhoneNumber: string;
  userType: UserRole;
  email?: string;
}

export interface CreateUserAccount extends CreateUser {
  uid: string;
}
