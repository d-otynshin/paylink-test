import { Device, DevicesResponse } from '../services/devices/types.ts';
import { FC } from 'react';
import { UseMutationResult } from '@tanstack/react-query';

type TableProps = {
  data: DevicesResponse;
  mutation: UseMutationResult<void, Error, number, unknown>
}

export const Table: FC<TableProps> = ({ data, mutation }) => {
  return (
    <table className="w-full border-collapse">
      <thead className="bg-gray-200">
      <tr>
        <th className="p-3 text-left">ID</th>
        <th className="p-3 text-left">Fingerprint</th>
        <th className="p-3 text-left">Created At</th>
        <th className="p-3 text-left">Actions</th>
      </tr>
      </thead>
      <tbody>
      {data.content.map((device: Device) => (
        <tr key={device.id} className="border-t">
          <td className="p-3">{device.id}</td>
          <td className="p-3">{device.fingerprint}</td>
          <td className="p-3">{new Date(device.createdAt).toLocaleString()}</td>
          <td className="p-3">
            <button
              onClick={() => mutation.mutate(device.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
