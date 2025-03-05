import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "../hooks/useAuth";
import { devicesService } from '../services/devices';
import { Device } from '../services/devices/types.ts';

const pageSize = 10;

export default function DevicesPage() {
  const [pageNumber, setPageNumber] = useState(1);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['devices', pageNumber],
    queryFn: async () => await devicesService.fetchDevices(pageNumber, pageSize),
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

        {/* Pagination */}
        <div className="flex justify-between items-center p-4">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
            disabled={pageNumber === 0}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
          Page {data.page.number + 1} of {data.page.totalPages}
        </span>
          <button
            onClick={() => setPageNumber((prev) => prev + 1)}
            disabled={pageNumber + 1 >= data.page.totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
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
