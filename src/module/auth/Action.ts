import { createAction } from '@core/util/AppUtil';
import { CreateUser, CreateProviderData } from '@core/models';
import { AuthRepository } from '@core/repository';
import { VerifyOTPAction } from '@core/models/Auth';

export const ModuleEvents = {
  LOG_IN: 'LOG_IN',
  CREATE_USER_ACCOUNT: 'CREATE_USER_ACCOUNT',
  CREATE_PROVIDER_ACCOUNT: 'CREATE_PROVIDER_ACCOUNT',
  VERIFY_PHONE_CODE: 'VERIFY_PHONE_CODE',
  USER_TYPE: 'USER_TYPE',
};

export default {
  logIn: createAction(ModuleEvents.LOG_IN, async credentials => {
    const res = await AuthRepository.sendPhoneVerification(credentials);
    return { credentials, response: res };
  }),
  createAccount: createAction(
    ModuleEvents.CREATE_USER_ACCOUNT,
    async (info: CreateUser) => {
      const res = await AuthRepository.createUserAccount(info);
      return { credentials: info, response: res };
    },
  ),

  createProviderAccount: createAction(
    ModuleEvents.CREATE_PROVIDER_ACCOUNT,
    (info: CreateProviderData) => info,
  ),
  onVerifyPhoneCode: createAction(
    ModuleEvents.VERIFY_PHONE_CODE,
    async (data: VerifyOTPAction) => {
      const res = await AuthRepository.logIn(data);
      return { response: res };
    },
  ),

  setUserType: createAction(ModuleEvents.USER_TYPE, (userType: string) => {
    return { userType };
  }),
};
