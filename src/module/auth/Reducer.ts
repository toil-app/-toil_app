import { Map } from 'immutable';
// import _ from 'lodash';
import { ModuleEvents } from './Action';
import { Action } from '../../core/util/AppUtil';

const InitialState = Map({
  credentials: null,
  createUserInfo: null,
  createProviderInfo: null,
  tempLoginData: null,
  userType: '',
});

export const Reducer = (
  state: Map<string, any> = InitialState,
  action: Action,
) => {
  const { payload, type } = action;
  switch (type) {
    case ModuleEvents.LOG_IN: {
      if (
        payload &&
        payload?.response &&
        !payload?.response?.error &&
        payload?.response.success
      ) {
        return state.set('credentials', payload.credentials);
      }
      return state;
    }
    case ModuleEvents.CREATE_USER_ACCOUNT: {
      if (
        payload &&
        payload?.response &&
        !payload?.response?.error &&
        payload?.response.success
      ) {
        return state.set('createUserInfo', payload.info);
      }
      return state;
    }
    case ModuleEvents.CREATE_PROVIDER_ACCOUNT: {
      if (
        payload &&
        payload?.response &&
        !payload?.response?.error &&
        payload?.response.success
      ) {
        return state.set('createProviderInfo', payload);
      }
      return state;
    }
    case ModuleEvents.VERIFY_PHONE_CODE: {
      if (
        payload &&
        !payload.error &&
        payload?.response &&
        payload?.response?.success
      ) {
        return state.set('tempLoginData', {});
      }
      return state;
    }
    case ModuleEvents.USER_TYPE: {
      if (payload && !payload.error) {
        return state.set('userType', payload.userType);
      }
      return state;
    }
  }
  return state;
};
