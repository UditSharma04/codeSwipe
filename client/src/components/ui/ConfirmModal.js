import React, { useState } from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, matchName }) => {
  const [inputValue, setInputValue] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white neubrutalism p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Remove Match</h2>
        <p className="text-gray-600 mb-4">
          Type "{matchName}" to remove this match
        </p>
        <input
          type="text"
          className="w-full p-2 neubrutalism mb-4"
          placeholder="Type name to confirm"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (e.target.value === matchName) {
              onConfirm();
              onClose();
            }
          }}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 neubrutalism hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 