import { BaseEntity } from './BaseEntity';

export interface ServiceCategory extends BaseEntity {
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export interface ServiceSubCategory extends BaseEntity {
  categoryId: string;
  name: string;
  description?: string;
  basePrice?: number;
  isActive: boolean;
}

export interface ProviderService extends BaseEntity {
  providerId: string;
  categoryId: string;
  subCategoryIds: string[];
  description?: string;
  pricing?: {
    hourlyRate?: number;
    dailyRate?: number;
    fixedPrice?: number;
  };
  availability?: {
    hoursPerWeek: number;
    timezone?: string;
  };
  isActive: boolean;
  rating?: number;
  reviewsCount?: number;
}

export interface ServiceReview extends BaseEntity {
  serviceId: string;
  providerId: string;
  clientId: string;
  bookingId: string;
  rating: number; // 1-5
  comment?: string;
  isVerifiedPurchase: boolean;
}
