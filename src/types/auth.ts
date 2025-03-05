export enum AuthStage {
  LOGIN = 'LOGIN',
  TWO_FACTORY_SETUP = 'TWO_FACTORY_SETUP',
  TWO_FACTORY_VERIFY = 'TWO_FACTORY_VERIFY',
}

export type TwoFaFormData = { code: string };

export enum TwoFactorStages {
  QR_CODE = 'QR_CODE',
  CODE_INPUT = 'CODE_INPUT',
}

export const TwoFactorSteps: Record<Exclude<AuthStage, AuthStage.LOGIN>, TwoFactorStages> = {
  [AuthStage.TWO_FACTORY_SETUP]: TwoFactorStages.QR_CODE,
  [AuthStage.TWO_FACTORY_VERIFY]: TwoFactorStages.CODE_INPUT,
}
