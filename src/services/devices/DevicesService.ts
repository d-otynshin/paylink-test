import { AxiosInstance } from 'axios';
import { DevicesResponse, IDevicesService } from './types.ts';

export class DevicesService implements IDevicesService {
  constructor(private apiClient: AxiosInstance) {}

  async fetchDevices(pageNumber: number, pageSize: number): Promise<DevicesResponse> {
    try {
      const { data } = await this.apiClient.get<DevicesResponse>('trusted-devices', {
        params: { pageNumber, pageSize },
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      throw new Error("Could not fetch devices. Please try again.");
    }
  }

  async deleteDevice(id: number): Promise<void> {
    await this.apiClient.delete(`/trusted-devices/${id}`);
  }
}
