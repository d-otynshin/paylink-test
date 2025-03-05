import { AuthStatus } from './types.ts';

export interface IAuthResponse {
  status: AuthStatus;
}

abstract class BaseAuthResponse implements IAuthResponse {
  protected constructor(public status: AuthStatus) {}
}

class SuccessResponse extends BaseAuthResponse {
  constructor(public token: string, public refreshToken: string) {
    super(AuthStatus.SUCCESS);
  }
}

class TwoFactorSetupResponse extends BaseAuthResponse {
  constructor(public totpQrCodeUrl: string, public tempToken: string) {
    super(AuthStatus.TWO_FA_SETUP_REQUIRED);
  }
}

class TwoFactorVerifyResponse extends BaseAuthResponse {
  constructor(public tempToken: string) {
    super(AuthStatus.TWO_FA_VERIFY_REQUIRED);
  }
}

class ErrorResponse extends BaseAuthResponse {
  constructor(public message: string) {
    super(AuthStatus.ERROR);
  }
}

class SuccessQrResponse implements IAuthResponse {
  status = AuthStatus.SUCCESS;
  constructor(public totpQrCodeUrl: string) {}
}

export type GenerateQrResponse = SuccessQrResponse | ErrorResponse;

export {
  ErrorResponse,
  SuccessResponse,
  BaseAuthResponse,
  SuccessQrResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
}
