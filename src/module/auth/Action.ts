import { createAction } from '../../core/util/AppUtil';

export const ModuleEvents = {
  LOG_IN: 'LOG_IN',
};

export default {
  logIn: createAction(ModuleEvents.LOG_IN, async credentials => {
    // const data = await AuthRepository.login(credentials);
    // if (data && data.success && data.data) {
    //   await LocalStorage.set('TOKEN_KEY', data.data.access_token);
    //   await LocalStorage.set('CURRENT_USER_ID', data.data.id);
    // }

    return credentials;
  }),
};
