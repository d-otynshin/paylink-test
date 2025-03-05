import { Dispatch, FC, SetStateAction } from 'react';
import { TwoFactorStages } from '../types/auth.ts';

type QRStepProps = {
  setStep: Dispatch<SetStateAction<TwoFactorStages>>;
}

export const QRStep: FC<QRStepProps> = ({ setStep }) => {
  return (
    <>
      <p className="text-sm mb-4">Scan this QR code with your authenticator app.</p>
      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">QR CODE</div>
      <button onClick={() => setStep(TwoFactorStages.CODE_INPUT)} className="w-full mt-4 bg-blue-600 text-white p-2 rounded">
        Next
      </button>
    </>
  )
}
