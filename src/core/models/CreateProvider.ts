export type CreateProviderStepOne = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  countryCode: string;
  callingCode: string;
  localPhoneNumber: string;
  userType: string;
  idNumber: string;
  nationality: string;
  dateOfBirth: string;
  internationalPhoneNumber: string;
};

export type DocumentFile = {
  id: string;
  name: string;
  sizeLabel?: string;
  size?: number;
  uri: string;
  mimeType?: string | null;
  source: 'camera' | 'image' | 'file';
};

export type CreateProviderStepTwo = {
  frontId: DocumentFile;
  backId: DocumentFile;
  birthCertificate: DocumentFile;
  addressProof: DocumentFile;
};

export interface QualificationData {
  qualification: DocumentFile[];
  years: string;
  details: string;
}

export type RequestedEmployee = {
  id: string;
  name: string;
};

export type SelectedService = {
  categoryId: string;
  selectedCategeory: string[];
};

export type CreateProviderStepFour = {
  mode: 'group';
  teamSize: number;
  requestEmployee: RequestedEmployee[];
  services: SelectedService[];
};

export type CreateProviderStepFive = {
  selfi: DocumentFile;
};

export type CreateProviderData = {
  stepOne: CreateProviderStepOne;
  stepTwo: CreateProviderStepTwo;
  stepThree: QualificationData;
  stepFour: CreateProviderStepFour;
  stepFive: CreateProviderStepFive;
};
