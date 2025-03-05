import { AxiosInstance } from 'axios';
import { AuthStatus, TAuthResponse } from './types.ts';

export class AuthService {
  constructor(private apiClient: AxiosInstance) {}

  async login(email: string, password: string): Promise<TAuthResponse> {
    try {
      const response = await this.apiClient.post('/auth', { email, password });

      if (response.status === 200) {
        return {
          status: AuthStatus.SUCCESS,
          token: response.data.token,
          refreshToken: response.data.refreshToken
        };
      }

      if (response.status === 202) {
        const { data } = response;

        if (data.twoFactorSetupRequired) {
          return {
            status: AuthStatus.TWO_FA_SETUP_REQUIRED,
            totpQrCodeUrl: data.totpQrCodeUrl,
            tempToken: data.tempToken,
          }
        }

        return {
          status: AuthStatus.TWO_FA_VERIFY_REQUIRED,
          tempToken: data.tempToken,
        }
      }

      return {
        status: AuthStatus.ERROR,
        message: 'Ошибка авторизации',
      }
    } catch {
      throw new Error('Ошибка входа: неверные учетные данные');
    }
  }

  async verify(totpCode: string, tempToken: string) {
    try {
      const response = await this.apiClient.post('/auth/two-factor/verify', { totpCode, tempToken });

      if (response.status === 200) {
        return {
          status: AuthStatus.SUCCESS,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        };
      }

      return {
        status: AuthStatus.ERROR,
        message: 'Ошибка авторизации',
      }
    } catch {
      throw new Error('Ошибка подтверждения 2FA');
    }
  }

  async setup(totpCode: string, tempToken: string) {
    try {
      const response = await this.apiClient.post('/auth/two-factor/set-up', { totpCode, tempToken });

      if (response.status === 200) {
        return {
          status: AuthStatus.SUCCESS,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        };
      }

      return {
        status: AuthStatus.ERROR,
        message: 'Ошибка авторизации',
      }
    } catch {
      throw new Error('Ошибка создания 2FA');
    }
  }

  async generateQr(tempToken: string) {
    try {
      const response = await this.apiClient.post('/auth/two-factor/generate-qr-code', { tempToken });

      if (response.status === 200) {
        return {
          status: AuthStatus.SUCCESS,
          totpQrCodeUrl: response.data.totpQrCodeUrl,
        };
      }

      return {
        status: AuthStatus.ERROR,
        message: 'Unexpected error occurred.',
      }
    } catch {
      throw new Error('Ошибка генерации QR');
    }
  }

  async authenticate(email: string, password: string): Promise<TAuthResponse> {
    const loginResponse = await this.login(email, password);

    if (loginResponse.status === AuthStatus.SUCCESS) {
      localStorage.setItem('token', loginResponse.token);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);

      return {
        status: AuthStatus.SUCCESS,
        token: loginResponse.token,
        refreshToken: loginResponse.refreshToken,
      };
    }

    if (loginResponse.status === AuthStatus.TWO_FA_SETUP_REQUIRED) {
      const generateQRResponse = await this.generateQr(loginResponse.tempToken);

      return {
        status: AuthStatus.TWO_FA_SETUP_REQUIRED,
        totpQrCodeUrl: generateQRResponse.totpQrCodeUrl,
        tempToken: loginResponse.tempToken,
      };
    }

    if (loginResponse.status === AuthStatus.TWO_FA_VERIFY_REQUIRED) {
      return {
        status: AuthStatus.TWO_FA_VERIFY_REQUIRED,
        tempToken: loginResponse.tempToken,
      };
    }

    return { status: AuthStatus.ERROR, message: 'Ошибка авторизации' };
  }

  logout() {
    localStorage.removeItem('token');
  }
}
