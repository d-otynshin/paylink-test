import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';

import { authService } from '../services/auth';
import { AuthStatus } from '../services/auth/types.ts';
import { TOTPForm } from './TOTPForm.tsx';
import { QRStep } from './QRStep.tsx';
import { AuthStage, TwoFactorStages, TwoFactorSteps, TwoFaFormData } from '../types/auth.ts';

interface TwoFactorModalProps {
  stage: Exclude<AuthStage, AuthStage.LOGIN>,
}

export const TwoFactorModal: FC<TwoFactorModalProps> = ({ stage }) => {
  const [step, setStep] = useState(TwoFactorSteps[stage]);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<TwoFaFormData>();

  const onSubmit = async (data: TwoFaFormData) => {
    try {
      const tempToken = localStorage.getItem('tempToken');
      if (!tempToken) return;

      const request = stage === AuthStage.TWO_FACTORY_SETUP ? 'setup' : 'verify';
      const response = await authService[request](data.code, tempToken)

      if (response.status === AuthStatus.SUCCESS) {
        localStorage.setItem('token', response.token);
        localStorage.removeItem('tempToken');

        navigate('/devices')
      }
    } catch (error: unknown) {
      console.error('Invalid 2FA code', error);
    }
  };

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />

        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 flex flex-col justify-center items-center">
            <Dialog.Title className="text-xl font-bold mb-4">
              {step === TwoFactorStages.QR_CODE ? "Setup Two-Factor Authentication" : "Enter Authentication Code"}
            </Dialog.Title>

            {step === TwoFactorStages.QR_CODE
              ? <QRStep setStep={setStep} />
              : <TOTPForm
                  errors={errors}
                  register={register}
                  onSubmit={handleSubmit(onSubmit)}
                />
            }
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
