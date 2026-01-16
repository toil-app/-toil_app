import { BaseEntity } from './BaseEntity';

export interface StoredFile {
  url: string;
  path: string;
  name: string;
  size?: number;
  contentType?: string;
  uploadedAt?: any;
}

export interface PersonalDocuments {
  idFront?: StoredFile;
  idBack?: StoredFile;
  birthCertificateFront?: StoredFile;
  birthCertificateBack?: StoredFile;
}

export interface ProfessionalQualification extends StoredFile {
  id?: string;
}

export interface UserFiles extends BaseEntity {
  userId: string;
  profilePhoto?: StoredFile;
  personalDocuments?: PersonalDocuments;
  professionalQualifications?: ProfessionalQualification[];
}

export interface BulkFileUpload {
  profilePhoto?: {
    uri: string;
    fileName: string;
    contentType?: string;
  };
  personalInfo?: {
    id_front?: {
      uri: string;
      fileName: string;
      contentType?: string;
    };
    id_back?: {
      uri: string;
      fileName: string;
      contentType?: string;
    };
    birthC_front?: {
      uri: string;
      fileName: string;
      contentType?: string;
    };
    birthC_back?: {
      uri: string;
      fileName: string;
      contentType?: string;
    };
  };
  professionalQualification?: Array<{
    uri: string;
    fileName: string;
    contentType?: string;
  }>;
}
