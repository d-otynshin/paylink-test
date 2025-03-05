export enum AuthStatus {
  SUCCESS = 'success',
  TWO_FA_SETUP_REQUIRED = '2fa_setup_required',
  TWO_FA_VERIFY_REQUIRED = '2fa_verify_required',
  ERROR = 'error',
}

export interface IAuthTokens {
  token: string;
  refreshToken: string;
}

interface ILoginResponse extends IAuthTokens {
  status: AuthStatus;
}

type AuthSuccess = {
  status: AuthStatus.SUCCESS;
  token: string;
  refreshToken: string;
};

type AuthTwoSetupFA = {
  status: AuthStatus.TWO_FA_SETUP_REQUIRED;
  totpQrCodeUrl: string;
  tempToken: string;
};

type AuthTwoVerifyFA = {
  status: AuthStatus.TWO_FA_VERIFY_REQUIRED;
  tempToken: string;
};

type AuthError = {
  status: AuthStatus.ERROR;
  message: string;
};

export type TAuthResponse = AuthSuccess | AuthTwoSetupFA | AuthTwoVerifyFA | AuthError;

export interface IAuthService {
  login(email: string, password: string): Promise<ILoginResponse | undefined>;
  verify2FA(code: string): Promise<{ tempToken: string; } | undefined>;
  logout(): void;
}
