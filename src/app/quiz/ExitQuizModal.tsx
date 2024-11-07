import React from "react";

interface ExitQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ExitQuizModal: React.FC<ExitQuizModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="border-4 border-border bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-100">Are you sure?</h2>
        <p className="mt-4 text-gray-400">
          Do you really want to exit the quiz? All progress will be lost.
        </p>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="w-[100px] px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="w-[100px] px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitQuizModal;
