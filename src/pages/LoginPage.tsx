import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { TwoFactorModal } from '../components/TwoFactorModal.tsx';
import { AuthStatus } from '../services/auth/types.ts';
import { LoginForm } from '../components/LoginForm.tsx';

type FormData = {
  email: string;
  password: string;
};

enum AuthStage {
  LOGIN = 'LOGIN',
  TWO_FACTORY_SETUP = 'TWO_FACTORY_SETUP',
  TWO_FACTORY_VERIFY = 'TWO_FACTORY_VERIFY',
}

const LoginPage: FC = () => {
  const [stage, setStage] = useState(AuthStage.LOGIN)
  const [error, setError] = useState<Error>()
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async ({ email, password }: FormData) => {
      return authService.authenticate(email, password);
    },
    onSuccess: (response) => {
      if (response.status === AuthStatus.ERROR) {
        throw new Error(response.message)
      }

      if (response.status === AuthStatus.SUCCESS) {
        localStorage.setItem('token', response.token);
        navigate('/devices');

        return;
      }

      if ([AuthStatus.TWO_FA_SETUP_REQUIRED, AuthStatus.TWO_FA_VERIFY_REQUIRED].includes(response.status)) {
        setStage(
          AuthStatus.TWO_FA_SETUP_REQUIRED === response.status
            ? AuthStage.TWO_FACTORY_SETUP
            : AuthStage.TWO_FACTORY_VERIFY
        );

        localStorage.setItem('tempToken', response.tempToken);

        return;
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      setError(error)
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      { stage === AuthStage.LOGIN
        ? <LoginForm onSubmit={onSubmit} error={error} />
        : <TwoFactorModal stage={stage} />
      }
    </div>
  );
};

export default LoginPage;
