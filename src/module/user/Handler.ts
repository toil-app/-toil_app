import { createLogger } from '../../core/util/AppUtil';
import { ModuleEvents } from './Action';
// import ToastService from '../../core/util/ToastService';
// import NavigationService from '../../core/util/NavigationService';
import { Actions } from '@core/modules/Actions';
// import { CreateUser } from '@core/models';

const Logger = createLogger('User');

export default {
  [ModuleEvents.GET_USER_BY_ID]: ({
    payload,
    appState,
    dispatch,
  }: {
    payload: any;
    appState: any;
    dispatch: any;
  }) => {
    if (!payload || payload.error || !payload.user || !payload.user.userId) {
      const user = appState.user.get('userInfo');
      if (user && user.userId) {
        dispatch(Actions.user.createUser({ user }));
        Logger.info(`User already exists in state with ID: ${user.userId}`);
        return;
      }
      Logger.error(
        'Failed to get user by ID:',
        payload ? payload.error : 'No payload',
      );
      return;
    }
    Logger.info(JSON.stringify(payload));
  },
};
