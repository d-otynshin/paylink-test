import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { devicesService } from '../services/devices';
import { Device } from '../services/devices/types.ts';
import { Pagination } from '../components/Pagination.tsx';

const PAGE_SIZE = 10;

export default function DevicesPage() {
  const [pageNumber, setPageNumber] = useState(1);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['devices', pageNumber],
    queryFn: async () => await devicesService.fetchDevices(pageNumber, PAGE_SIZE),
  });

  const mutation = useMutation({
    mutationFn: async (id: number) => await devicesService.deleteDevice(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['devices'] }); // Refresh data after deletion
    },
  });

  if (!data) return null;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching devices.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Your Devices</h1>

      <div className="border rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
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

        <Pagination setPageNumber={setPageNumber} pageNumber={pageNumber} data={data} />
      </div>

      <button
        onClick={() => {
          logout();
          navigate('/login');
        }}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
