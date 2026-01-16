import {
  Coordinates,
  RegisteredLocation,
  UserFB,
} from '@core/models/firebase/UserFB';
import { createAction } from '@core/util/AppUtil';
import { ServiceCategeoryRepository, UserRepositoryFb } from '@core/repository';
import _ from 'lodash';

export const ModuleEvents = {
  GET_ALL_CATEGERIES: 'GET_ALL_CATEGERIES',
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER_COORDINATES: 'UPDATE_USER_COORDINATES',
  ADD_USER_ADDRESS: 'ADD_USER_ADDRESS',
  ADD_RATE_TO_USER: 'ADD_RATE_TO_USER',
  GET_USER_BY_ID: 'GET_USER_BY_ID',
  GET_USER_LOCATIONS: 'GET_USER_LOCATIONS',
  ADD_USER_LOCATION: 'ADD_USER_LOCATION',
  UPDATE_ALL_USER_LOCATIONS: 'UPDATE_ALL_USER_LOCATIONS',
};

export default {
  getAllCategeries: createAction(ModuleEvents.GET_ALL_CATEGERIES, async () => {
    const limit = 50;
    let allData: any[] = [];
    let pageToken: string | undefined = undefined;
    let hasMore = true;

    while (hasMore) {
      const res = await ServiceCategeoryRepository.getServiceCategories({
        limit,
        pageToken,
      });
      const items = _.get(res, 'data', []);
      allData = allData.concat(items);
      const count = _.get(res, 'count', 0);
      pageToken = _.get(res, 'nextPageToken');
      hasMore = count > allData.length && !!pageToken;
    }
    return allData;
  }),

  createUser: createAction(
    ModuleEvents.CREATE_USER,
    async (userData: UserFB) => {
      const newUserId = await UserRepositoryFb.addUser(userData);
      const newUser = await UserRepositoryFb.getUserById(newUserId!);
      return { user: newUser };
      // This should interact with UserRepository similar to the provided snippet
    },
  ),

  updateUserCoordinates: createAction(
    ModuleEvents.UPDATE_USER_COORDINATES,
    async (data: { userId: string; coordinates: Coordinates }) => {
      await UserRepositoryFb.updateUserCoordinates(
        data.userId,
        data.coordinates,
      );
      return { success: true };
    },
  ),

  addUserAddress: createAction(
    ModuleEvents.ADD_USER_ADDRESS,
    async ({
      userId,
      location,
    }: {
      userId: string;
      location: RegisteredLocation;
    }) => {
      return await UserRepositoryFb.updateUserRegistedLocation(
        userId,
        location,
      );
    },
  ),

  getUserById: createAction(
    ModuleEvents.GET_USER_BY_ID,
    async (userId: string) => {
      const user = await UserRepositoryFb.getUserById(userId);
      return { user };
    },
  ),

  getUserLocations: createAction(
    ModuleEvents.GET_USER_LOCATIONS,
    async (userId: string) => {
      const locations = await UserRepositoryFb.getUserRegistedLocationList(
        userId,
      );
      return { locations };
    },
  ),

  addUserLocation: createAction(
    ModuleEvents.ADD_USER_LOCATION,
    async ({
      userId,
      location,
    }: {
      userId: string;
      location: RegisteredLocation;
    }) => {
      return await UserRepositoryFb.updateUserRegistedLocation(
        userId,
        location,
      );
    },
  ),

  updateAllUserLocations: createAction(
    ModuleEvents.UPDATE_ALL_USER_LOCATIONS,
    async ({
      userId,
      locations,
    }: {
      userId: string;
      locations: RegisteredLocation[];
    }) => {
      return await UserRepositoryFb.updateAllRegistedLocations(
        userId,
        locations,
      );
    },
  ),
};
