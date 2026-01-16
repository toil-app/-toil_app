// import {Actions} from '../../core/modules/Actions';
import { createLogger } from '../../core/util/AppUtil';
import { ModuleEvents } from './Action';
import ToastService from '../../core/util/ToastService';
import NavigationService from '../../core/util/NavigationService';
import _ from 'lodash';
import LocalStorage from '@core/service/LocalStorage.service';
import { StorageKey } from '@core/util/keys';
import { Actions } from '@core/modules/Actions';
// import { CreateUser } from '@core/models';

const Logger = createLogger('Auth');

export default {
  [ModuleEvents.LOG_IN]: ({ payload }: { payload: any }) => {
    if (
      payload &&
      payload?.response &&
      !payload?.response?.error &&
      payload?.response.success
    ) {
      ToastService.success('phone_verification_code_sent');

      NavigationService.navigate('PhoneNumberVerificationScreen', {
        phoneNumber: payload.credentials.phoneNumber,
      });
      Logger.info(JSON.stringify(payload));
      return;
    }

    ToastService.error('phone_verification_failed');
    return;
  },

  [ModuleEvents.CREATE_USER_ACCOUNT]: ({ payload }: { payload: any }) => {
    if (
      payload &&
      payload?.response &&
      !payload?.response?.error &&
      payload?.response.success
    ) {
      NavigationService.navigate('PhoneNumberVerificationScreen', {
        phoneNumber: payload.credentials.phoneNumber,
      });
      Logger.info('User account creation info saved.', payload);
      return;
    }

    ToastService.error('user_account_creation_failed');
    return;
    // ToastService.success('user_account_created_successfully');
  },

  [ModuleEvents.CREATE_PROVIDER_ACCOUNT]: ({ payload }: { payload: any }) => {
    NavigationService.navigate('Provider', { providerData: payload });
    ToastService.success('provider_account_created_successfully');
    Logger.info('Provider account creation info saved.', payload);
  },

  [ModuleEvents.VERIFY_PHONE_CODE]: ({
    payload,
    dispatch,
  }: {
    payload: any;
    dispatch: any;
  }) => {
    if (
      !payload ||
      !payload.response ||
      !payload.response.data ||
      payload.error ||
      payload.response?.error ||
      !payload.response.success
    ) {
      ToastService.error('invalid_verification_code');
      return;
    }
    ToastService.success('phone_verification_successful');
    console.log(
      'Payload after verification:',
      !payload ||
        !payload.response ||
        !payload.response.data ||
        payload.error ||
        payload?.response?.error ||
        !payload.response.success,
    );
    // TODO:save login access token
    const token = _.get(payload, 'response.data.token', '');
    LocalStorage.set(StorageKey.TOKEN_KEY, token);
    // navigation to home screen after verification by user type
    NavigationService.navigate('User');

    // calling initial actions to load data
    dispatch(Actions.user.getAllCategeries());
    dispatch(
      Actions.user.getUserById(_.get(payload, 'response.data.user', null)),
    );
    Logger.info('Phone verification successful.', payload);
  },
};
