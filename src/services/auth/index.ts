import { AuthService } from './AuthService.ts';
import { api } from '../../api';

export const authService = new AuthService(api);
