export type {
  BaseEntity,
  QueryOptions,
  PaginationOptions,
  SortOptions,
  FilterCondition,
  ApiResponse,
  ListResponse,
} from './BaseEntity';

export type { CreateUser, CreateUserAccount } from './CreateUser';

export type {
  CreateProviderStepOne,
  CreateProviderStepTwo,
  DocumentFile,
  QualificationData,
  RequestedEmployee,
  SelectedService,
  CreateProviderStepFour,
  CreateProviderStepFive,
  CreateProviderData,
} from './CreateProvider';

export type { User, ServiceProvider } from './User';
export { UserRole, UserStatus } from './User';

import NetworkError from './errors/NetworkError';

export { NetworkError };

export type {
  ServiceCategory,
  ServiceSubCategory,
  ProviderService,
  ServiceReview,
} from './Service';

export type {
  Booking,
  BookingLocation,
  BookingSchedule,
  BookingAmount,
  BookingMessage,
} from './Booking';
export { BookingStatus } from './Booking';

export type { Team, TeamMember } from './Team';
export { TeamMemberRole, TeamMemberStatus } from './Team';

export type { AuthUser, FirestoreUser, PhoneAuthResult } from './Auth';

export type {
  UploadFileOptions,
  UploadedFile,
  StoredFile,
  PersonalDocuments,
  ProfessionalQualification,
  UserFiles,
  BulkFileUpload,
} from './FileStorage';
