import { Map } from 'immutable';
import _ from 'lodash';
import { ModuleEvents } from './Action';
import { ModuleEvents as AuthModuleEvent } from '@module/auth/Action';
import { Action } from '../../core/util/AppUtil';

const InitialState = Map({
  userInfo: null,
  categeries: [],
  firebaseUserInfo: null,
  userLocations: [],
});

export const Reducer = (
  state: Map<string, any> = InitialState,
  action: Action,
) => {
  const { payload, type } = action;
  switch (type) {
    case ModuleEvents.GET_ALL_CATEGERIES: {
      if (payload && !payload.error) {
        return state.set('categeries', _.get(payload, '[0].items', []));
      }
      return state;
    }

    case AuthModuleEvent.VERIFY_PHONE_CODE: {
      if (
        payload &&
        !payload.error &&
        payload?.response?.data &&
        !payload.response.error &&
        payload?.response?.success &&
        payload?.response?.data?.user
      ) {
        return state.set(
          'userInfo',
          _.get(payload, 'response.data.user', null),
        );
      }
      return state;
    }

    case ModuleEvents.GET_USER_BY_ID: {
      if (payload && !payload.error && payload.user && payload.user.userId) {
        return state.set('firebaseUserInfo', payload.user);
      }
      return state;
    }

    case ModuleEvents.CREATE_USER: {
      if (payload && !payload.error && payload.user) {
        return state.set('firebaseUserInfo', payload.user);
      }
      return state;
    }

    case ModuleEvents.GET_USER_LOCATIONS: {
      if (payload && !payload.error && payload.locations) {
        return state.set('userLocations', payload.locations);
      }
      return state;
    }
  }
  return state;
};
