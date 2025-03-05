import { AuthStatus } from './types.ts';

import {
  BaseAuthResponse,
  ErrorResponse,
  SuccessResponse,
  SuccessQrResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
} from './auth-types.ts';

export function isSuccessResponse(response: unknown): response is SuccessResponse {
  return (response as SuccessResponse).status === AuthStatus.SUCCESS;
}

export function isTwoFactorSetupResponse(response: unknown): response is TwoFactorSetupResponse {
  return (response as TwoFactorSetupResponse).status === AuthStatus.TWO_FA_SETUP_REQUIRED;
}

export function isTwoFactorVerifyResponse(response: unknown): response is TwoFactorVerifyResponse {
  return (response as TwoFactorVerifyResponse).status === AuthStatus.TWO_FA_VERIFY_REQUIRED;
}

export function isSuccessQrResponse(response: unknown): response is SuccessQrResponse {
  return (response as SuccessQrResponse).status === AuthStatus.SUCCESS;
}

export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (response as ErrorResponse).status === AuthStatus.ERROR;
}

export function isTwoFactorResponse(response: unknown): response is TwoFactorSetupResponse | TwoFactorVerifyResponse {
  return [AuthStatus.TWO_FA_SETUP_REQUIRED, AuthStatus.TWO_FA_VERIFY_REQUIRED].includes((response as BaseAuthResponse).status);
}
