import { LoginAction } from '@core/models/Auth';
import Repository from './Repository';

class AuthRepository extends Repository {
  constructor() {
    super('auth');
  }

  /**
   * Register a new user account
   */
  async register(userData: any) {
    return this.post('/register', userData);
  }

  /**
   * Login user with credentials
   */
  async logIn(credentials: {
    phoneNumber: string;
    otp: string;
    userType: string;
  }) {
    return this.post('/login', credentials);
  }

  /**
   * Send OTP to phone number
   */
  async sendPhoneVerification(credentials: LoginAction) {
    return this.post('/send-otp', credentials);
  }

  /**
   * Verify OTP code
   */
  async verifyPhoneCode(phoneNumber: string, code: string) {
    return this.post('/verify-otp', { phoneNumber, code });
  }

  /**
   * Resend OTP to phone number
   */
  async resendOTP(phoneNumber: string) {
    return this.post('/resend-otp', { phoneNumber });
  }

  /**
   * Create user account
   */
  async createUserAccount(userData: any) {
    return this.post('/register', userData);
  }

  /**
   * Create provider account
   */
  async createProviderAccount(providerData: any) {
    return this.post('/register', providerData);
  }
}

export default new AuthRepository();
