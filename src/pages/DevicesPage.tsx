import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { devicesService } from '../services/devices';
import { Pagination } from '../components/Pagination.tsx';
import { Table } from '../components/Table.tsx';
import { Button } from '../components/Button.tsx';

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

  const mutation = useMutation<void, Error, number>({
    mutationFn: async (id) => await devicesService.deleteDevice(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });

  const onClick = () => {
    logout();
    navigate('/login');
  };

  if (!data) return null;
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching devices.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Your Devices</h1>

      <div className="border rounded-lg shadow-lg overflow-hidden w-full max-w-5xl">
        <Table data={data} mutation={mutation} />
        <Pagination setPageNumber={setPageNumber} pageNumber={pageNumber} data={data} />
      </div>

      <Button onClick={onClick} />
    </div>
  );
}
