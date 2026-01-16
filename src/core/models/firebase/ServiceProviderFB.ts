import { Address, Coordinates, Rate } from './UserFB';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type ServiceProviderFB = {
  id: string;
  name: string;
  serviceType: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: Address;
  rating?: Array<Rate>;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
  coordinates?: Coordinates;
  experinceLevel?: 'beginner' | 'intermediate' | 'expert';
  userType: string;
};
