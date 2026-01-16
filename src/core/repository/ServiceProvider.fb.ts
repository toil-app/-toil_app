import { Rate } from '@core/models/firebase/UserFB';
import { FirestoreBaseRepository } from './Repository.fb';
import { ServiceProviderFB } from '@core/models/firebase/ServiceProviderFB';

class ServiceProviderRepository extends FirestoreBaseRepository<ServiceProviderFB> {
  constructor() {
    super('serviceProviders'); // collection name passed here
  }

  async getServiceProviderById(
    serviceProviderId: string,
  ): Promise<ServiceProviderFB | null> {
    try {
      const doc = await this.collectionRef.doc(serviceProviderId).get();
      if (doc.exists()) {
        return doc.data() as ServiceProviderFB;
      }
      return null;
    } catch (error) {
      console.error('Error fetching service provider by ID:', error);
      return null;
    }
  }

  async addServiceProvider(
    serviceProvider: ServiceProviderFB,
  ): Promise<string | null> {
    try {
      const serviceProviderId = await this.create(serviceProvider);
      return serviceProviderId;
    } catch (error) {
      console.error('Error adding service provider:', error);
      return null;
    }
  }

  async updateServiceProvider(
    serviceProviderId: string,
    serviceProviderData: Partial<ServiceProviderFB>,
  ): Promise<void> {
    try {
      await this.set(serviceProviderId, serviceProviderData as any);
    } catch (error) {
      console.error('Error updating service provider:', error);
      throw error;
    }
  }

  async filterServiceProvidersByAnyField(
    field: keyof ServiceProviderFB,
    value: any,
  ): Promise<ServiceProviderFB[]> {
    try {
      const querySnapshot = await this.collectionRef
        .where(field as any, '==', value)
        .get();

      const serviceProviders: ServiceProviderFB[] = [];
      querySnapshot.forEach(doc => {
        serviceProviders.push(doc.data() as ServiceProviderFB);
      });

      return serviceProviders;
    } catch (error) {
      console.error('Error filtering service providers:', error);
      return [];
    }
  }

  updateServiceProviderStatus = async (
    serviceProviderId: string,
    status: string,
  ): Promise<void> => {
    try {
      await this.set(serviceProviderId, { status } as any);
    } catch (error) {
      console.error('Error updating service provider status:', error);
      throw error;
    }
  };

  updateServiceProviderLocation = async (
    serviceProviderId: string,
    location: { latitude: number; longitude: number },
  ): Promise<void> => {
    try {
      await this.set(serviceProviderId, { location } as any);
    } catch (error) {
      console.error('Error updating service provider location:', error);
      throw error;
    }
  };

  updateServiceProviderAvailability = async (
    serviceProviderId: string,
    availability: boolean,
  ): Promise<void> => {
    try {
      await this.set(serviceProviderId, { availability } as any);
    } catch (error) {
      console.error('Error updating service provider availability:', error);
      throw error;
    }
  };

  updateServiceProviderRating = async (
    serviceProviderId: string,
    rating: Rate,
  ): Promise<void> => {
    try {
      await this.set(serviceProviderId, { rating } as any);
    } catch (error) {
      console.error('Error updating service provider rating:', error);
      throw error;
    }
  };

  filterServiceProvidersByRating = async (
    minRating: number,
  ): Promise<ServiceProviderFB[]> => {
    try {
      const snapshot = await this.collectionRef.get();
      const serviceProviders: ServiceProviderFB[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as ServiceProviderFB;
        if (Array.isArray(data.rating) && data.rating.some(r => r.rate >= minRating)) {
          serviceProviders.push(data);
        }
      });
      return serviceProviders;
    } catch (error) {
      console.error('Error filtering service providers by rating:', error);
      return [];
    }
  };
}

export default ServiceProviderRepository;
