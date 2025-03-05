import * as Dialog from "@radix-ui/react-dialog";
import { FC, useState } from 'react';
import { useForm } from "react-hook-form";
import { authService } from '../services/auth';
import { AuthStatus } from '../services/auth/types.ts';
import { useNavigate } from 'react-router-dom';

enum AuthStage {
  LOGIN = 'LOGIN',
  TWO_FACTORY_SETUP = 'TWO_FACTORY_SETUP',
  TWO_FACTORY_VERIFY = 'TWO_FACTORY_VERIFY',
}

type FormData = { code: string };

enum TwoFactorStages {
  QR_CODE = 'QR_CODE',
  CODE_INPUT = 'CODE_INPUT',
}

const TwoFactorSteps: Record<Exclude<AuthStage, AuthStage.LOGIN>, TwoFactorStages> = {
  [AuthStage.TWO_FACTORY_SETUP]: TwoFactorStages.QR_CODE,
  [AuthStage.TWO_FACTORY_VERIFY]: TwoFactorStages.CODE_INPUT,
}

interface TwoFactorModalProps {
  stage: Exclude<AuthStage, AuthStage.LOGIN>,
}

export const TwoFactorModal: FC<TwoFactorModalProps> = ({ stage }) => {
  const [step, setStep] = useState(TwoFactorSteps[stage]);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
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

            {step === TwoFactorStages.QR_CODE ? (
              <>
                <p className="text-sm mb-4">Scan this QR code with your authenticator app.</p>
                <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">QR CODE</div>
                <button onClick={() => setStep(TwoFactorStages.CODE_INPUT)} className="w-full mt-4 bg-blue-600 text-white p-2 rounded">
                  Next
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  {...register('code', { required: "Code is required", pattern: { value: /^[0-9]{6}$/, message: "Must be 6 digits" } })}
                  type="text"
                  maxLength={6}
                  className="border p-2 rounded w-full text-center"
                  placeholder="Enter 6-digit code"
                />
                {errors.code && <p className="text-red-500 text-sm">{errors.code.message}</p>}

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                  Verify
                </button>
              </form>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
