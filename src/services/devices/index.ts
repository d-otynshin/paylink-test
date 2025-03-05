import { DevicesService } from './devices-service.ts';
import { api } from '../../api';

export const devicesService = new DevicesService(api);
