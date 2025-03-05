import { DevicesService } from './DevicesService';
import { api } from '../../api';

export const devicesService = new DevicesService(api);
