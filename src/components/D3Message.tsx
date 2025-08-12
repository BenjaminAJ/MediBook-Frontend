import React from 'react';

type D3MessageProps = {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
};

const colors = {
  success: 'bg-green-100 border-green-400 text-green-700',
  error: 'bg-red-100 border-red-400 text-red-700',
};

const D3Message: React.FC<D3MessageProps> = ({ type, message, onClose }) => (
  <div
    className={`border-l-4 p-4 mb-4 rounded ${colors[type]} flex items-center justify-between`}
    role={type === 'error' ? 'alert' : 'status'}
  >
    <span>{message}</span>
    {onClose && (
      <button
        onClick={onClose}
        className="ml-4 text-xl font-bold focus:outline-none"
        aria-label="Close"
        type="button"
      >
        &times;
      </button>
    )}
  </div>
);

export default D3Message;
