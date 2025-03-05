import { FC, FormEvent } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

type FormData = { code: string };

type FormComponentProps<T extends FieldValues> = {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export const TOTPForm: FC<FormComponentProps<FormData>> = ({ onSubmit, errors, register }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
  )
}
