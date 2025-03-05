export interface IDevicesService {
  fetchDevices(page: number, size: number): Promise<DevicesResponse>;
  deleteDevice(id: number): Promise<void>;
}

export type Device = {
  id: number;
  fingerprint: string;
  createdAt: Date;
}

type Pagination = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export type DevicesResponse = {
  content: Device[];
  page: Pagination;
}
