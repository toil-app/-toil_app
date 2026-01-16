import { FirestoreBaseRepository } from '../repository/Repository.fb';
import { RegisteredLocation, UserFB } from '@core/models/firebase/UserFB';

class UserRepositoryFB extends FirestoreBaseRepository<UserFB> {
  constructor() {
    super('users'); // collection name passed here
  }

  async getUserById(userId: string): Promise<UserFB | null> {
    try {
      const doc = await this.collectionRef.doc(userId).get();
      if (doc.exists()) {
        return doc.data() as UserFB;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  async addUser(user: UserFB): Promise<string | null> {
    try {
      const userId = await this.create(user);
      return userId;
    } catch (error) {
      console.error('Error adding user:', error);
      return null;
    }
  }

  async updateUser(userId: string, userData: Partial<UserFB>): Promise<void> {
    try {
      await this.set(userId, userData as any);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async filterUsersByAnyField(
    field: keyof UserFB,
    value: any,
  ): Promise<UserFB[]> {
    try {
      const querySnapshot = await this.collectionRef
        .where(field as any, '==', value)
        .get();

      const users: UserFB[] = [];
      querySnapshot.forEach(doc => {
        users.push(doc.data() as UserFB);
      });

      return users;
    } catch (error) {
      console.error('Error filtering users:', error);
      return [];
    }
  }

  findUserById = async (userId: string): Promise<UserFB | null> => {
    return this.getUserById(userId);
  };

  updateUserCoordinates = async (
    userId: string,
    coordinates: { latitude: number; longitude: number },
  ): Promise<void> => {
    try {
      await this.set(userId, { coordinates } as any);
    } catch (error) {
      console.error('Error updating user coordinates:', error);
      throw error;
    }
  };

  updateUserRegistedLocation = async (
    userId: string,
    location: RegisteredLocation,
  ): Promise<void> => {
    try {
      const user = await this.getUserById(userId);
      let locations: RegisteredLocation[] = [];
      if (user && Array.isArray(user.registedLocations)) {
        locations = [...user.registedLocations];
      }
      locations.push(location);
      await this.set(userId, { registedLocations: locations } as any);
    } catch (error) {
      console.error('Error updating user registered location:', error);
      throw error;
    }
  };

  getUserRegistedLocationList = async (
    userId: string,
  ): Promise<RegisteredLocation[] | null> => {
    try {
      const user = await this.getUserById(userId);
      if (user && Array.isArray(user.registedLocations)) {
        return user.registedLocations;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user registered locations:', error);
      return null;
    }
  };

  updateAllRegistedLocations = async (
    userId: string,
    locations: RegisteredLocation[],
  ): Promise<void> => {
    try {
      await this.set(userId, { registedLocations: locations } as any);
    } catch (error) {
      console.error('Error updating all user registered locations:', error);
      throw error;
    }
  };
}

export default new UserRepositoryFB();
