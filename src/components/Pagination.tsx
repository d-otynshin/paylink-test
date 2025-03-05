import { DevicesResponse } from '../services/devices/types.ts';
import { Dispatch, FC, SetStateAction } from 'react';

type PaginationProps = {
  data: DevicesResponse,
  setPageNumber: Dispatch<SetStateAction<number>>;
  pageNumber: number;
}

export const Pagination: FC<PaginationProps> = ({ setPageNumber, data, pageNumber }) => {
  return (
    <div className="flex justify-between items-center p-4">
      <button
        onClick={() => setPageNumber((prev) => Math.max(prev - 1, 0))}
        disabled={pageNumber === 1}
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
  )
}
