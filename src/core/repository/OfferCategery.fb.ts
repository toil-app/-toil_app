import { OfferCategeryFB } from '@core/models/firebase/OfferType';
import { FirestoreBaseRepository } from './Repository.fb';

export class OfferCategery extends FirestoreBaseRepository<OfferCategeryFB> {
  constructor() {
    super('offerCategery'); // collection name passed here
  }

  getOfferCategeryById = async (
    id: string,
  ): Promise<OfferCategeryFB | null> => {
    try {
      const doc = await this.collectionRef.doc(id).get();
      if (doc.exists()) {
        return doc.data() as OfferCategeryFB;
      }
      return null;
    } catch (error) {
      console.error('Error fetching offer categery by ID:', error);
      return null;
    }
  };

  addOfferCategery = async (
    offerCategery: OfferCategeryFB,
  ): Promise<string | null> => {
    try {
      const offerCategeryId = await this.create(offerCategery);
      return offerCategeryId;
    } catch (error) {
      console.error('Error adding offer categery:', error);
      return null;
    }
  };

  updateOfferCategery = async (
    offerCategeryId: string,
    offerCategeryData: Partial<OfferCategeryFB>,
  ): Promise<void> => {
    try {
      await this.set(offerCategeryId, offerCategeryData as any);
    } catch (error) {
      console.error('Error updating offer categery:', error);
      throw error;
    }
  };

  filterOfferCategeryByAnyStatus = async (
    field: keyof OfferCategeryFB,
    value: any,
  ): Promise<OfferCategeryFB[]> => {
    try {
      const querySnapshot = await this.collectionRef
        .where(field as any, '==', value)
        .get();

      const offerCategerys: OfferCategeryFB[] = [];
      querySnapshot.forEach(doc => {
        offerCategerys.push(doc.data() as OfferCategeryFB);
      });

      return offerCategerys;
    } catch (error) {
      console.error('Error filtering offer categery by status:', error);
      return [];
    }
  };
}
