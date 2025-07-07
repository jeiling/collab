import React from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onCancel: () => void;
  onOk: () => void;
  okDisabled?: boolean;
  isShowCancel?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  title,
  children,
  okDisabled,
  isShowCancel = true,
  onCancel,
  onOk,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      <div className="z-50 w-full max-w-md bg-white rounded-2xl shadow-xl p-6 animate-fade-in">
        {title && (
          <div className="text-xl font-semibold mb-4 text-black">{title}</div>
        )}
        <div className="mb-6 text-gray-700">{children}</div>
        <div className="flex justify-end space-x-2">
          {isShowCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onOk}
            disabled={okDisabled}
            className={`
              px-4 py-2 rounded-md transition
              ${
                okDisabled
                  ? "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
              }
            `}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
