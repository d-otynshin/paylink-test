import { FC } from 'react';

type ButtonProps = {
  onClick: () => void;
}

export const Button: FC<ButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
  >
    Logout
  </button>
)
