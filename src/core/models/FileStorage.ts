export interface UploadFileOptions {
  uri: string;
  fileName: string;
  contentType?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadedFile {
  url: string;
  path: string;
  name: string;
  size?: number;
  contentType?: string;
}

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

export interface UserFiles {
  userId: string;
  profilePhoto?: StoredFile;
  personalDocuments?: PersonalDocuments;
  professionalQualifications?: ProfessionalQualification[];
  createdAt?: any;
  updatedAt?: any;
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
