export interface ExperienceMultiplier {
  intermediate: number;
  expert: number;
  beginner: number;
  master: number;
}

export interface ChargeFactors {
  perPerson: number;
  perHour: number;
  experienceMultiplier: ExperienceMultiplier;
}

export interface Pricing {
  baseCharge: number;
  currency: string;
  chargeFactors: ChargeFactors;
}

export interface Categery {
  categoryId: string;
  name: string;
  description: string;
  parentCategoryId: string | null;
  isSubcategory: boolean;
  country: string | null;
  imageUrl: string;
  pricing: Pricing;
  requiredPeople: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
