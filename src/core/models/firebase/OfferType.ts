export type OfferCategeryFB = {
  categeryId: string;
  categeryName: string;
  categeryDescription?: string;
  subcategeries?: Array<{
    subcategryId: string;
    subcategryName: string;
    subcategryDescription?: string;
  }>;
  price?: number;
  maxAmountOfMens?: number;
  minAmountOfMens?: number;
  prcentage?: number;
  status?: 'active' | 'inactive';
  activeDate?: Date;
  validDurationInDays?: number;
};
