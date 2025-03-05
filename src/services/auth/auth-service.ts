import { AxiosInstance, AxiosResponse } from 'axios';
import { AuthStatus, TAuthResponse } from './types.ts';

import {
  ErrorResponse,
  SuccessResponse,
  BaseAuthResponse,
  SuccessQrResponse,
  GenerateQrResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
} from './auth-types.ts';

import {
  isSuccessQrResponse,
  isSuccessResponse,
  isTwoFactorSetupResponse,
  isTwoFactorVerifyResponse
} from './auth-guards.ts';

export class AuthService {
  constructor(private apiClient: AxiosInstance) {}

  private handleResponse(response: AxiosResponse): BaseAuthResponse {
    const { status, data } = response;

    switch (status) {
      case 200:
        return new SuccessResponse(data.token, data.refreshToken);

      case 202:
        return data.twoFactorSetupRequired
          ? new TwoFactorSetupResponse(data.totpQrCodeUrl, data.tempToken)
          : new TwoFactorVerifyResponse(data.tempToken);

      default:
        return new ErrorResponse('Ошибка авторизации');
    }
  }

  async login(email: string, password: string): Promise<BaseAuthResponse> {
    try {
      const response = await this.apiClient.post('/auth', { email, password });
      return this.handleResponse(response);
    } catch {
      return new ErrorResponse('Ошибка входа: неверные учетные данные');
    }
  }

  async verify(totpCode: string, tempToken: string): Promise<BaseAuthResponse> {
    try {
      const response = await this.apiClient.post('/auth/two-factor/verify', {
        totpCode,
        tempToken,
      });

      return this.handleResponse(response);
    } catch {
      throw new Error("Ошибка подтверждения 2FA");
    }
  }

  async setup(totpCode: string, tempToken: string): Promise<BaseAuthResponse> {
    try {
      const response = await this.apiClient.post('/auth/two-factor/set-up', {
        totpCode,
        tempToken,
      });

      return this.handleResponse(response);
    } catch {
      throw new Error("Ошибка создания 2FA");
    }
  }

  async generateQr(tempToken: string): Promise<GenerateQrResponse> {
    try {
      const response = await this.apiClient.post(
        '/auth/two-factor/generate-qr-code',
        { tempToken }
      );

      if (response.status === 200) {
        return new SuccessQrResponse(response.data.totpQrCodeUrl);
      }

      return new ErrorResponse("Ошибка генерации QR");
    } catch {
      throw new Error("Ошибка генерации QR");
    }
  }


  async authenticate(email: string, password: string): Promise<TAuthResponse> {
    const loginResponse = await this.login(email, password);

    if (isSuccessResponse(loginResponse)) {
      localStorage.setItem('token', loginResponse.token);
      localStorage.setItem('refreshToken', loginResponse.refreshToken);

      return {
        status: AuthStatus.SUCCESS,
        token: loginResponse.token,
        refreshToken: loginResponse.refreshToken,
      };
    }

    if (isTwoFactorSetupResponse(loginResponse)) {
      const generateQRResponse = await this.generateQr(loginResponse.tempToken);

      if (isSuccessQrResponse(generateQRResponse)) {
        return {
          status: AuthStatus.TWO_FA_SETUP_REQUIRED,
          totpQrCodeUrl: generateQRResponse.totpQrCodeUrl,
          tempToken: loginResponse.tempToken,
        };
      }

      return { status: AuthStatus.ERROR, message: 'Ошибка авторизации' };
    }

    if (isTwoFactorVerifyResponse(loginResponse)) {
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
