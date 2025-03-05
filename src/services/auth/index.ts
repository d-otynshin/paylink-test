import { api } from '../../api';
import { AuthService } from './auth-service.ts';

export const authService = new AuthService(api);
