import { User } from './../User';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export type Rate = {
  userId: string;
  rate: number;
  comment?: string;
};

export type Address = {
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  streetAddress?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type RegisteredLocation = {
  id: string;
  label: string;
  address?: Address;
  coordinates?: Coordinates;
};

export type UserFB = User & {
  phoneNumber: string;
  createdAt: FirebaseFirestoreTypes.Timestamp;
  updatedAt?: FirebaseFirestoreTypes.Timestamp;
  userId: string;
  cureentAddress?: Address;
  currentCoordinates?: Coordinates;
  registedLocations?: Array<RegisteredLocation>;
  rates: Array<Rate>;
  userType: string;
};
