import React from "react";
import { Modal } from "./Modal.jsx";

export const ConfirmDialog = ({
  open,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal open={open} title={title} onClose={onCancel} widthClassName="max-w-md">
      <div className="text-sm text-gray-600 dark:text-gray-300">{message}</div>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={[
            "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-60",
            danger
              ? "bg-rose-600 text-white hover:bg-rose-700"
              : "bg-indigo-600 text-white hover:bg-indigo-700",
          ].join(" ")}
          disabled={isLoading}
        >
          {isLoading ? "Working..." : confirmText}
        </button>
      </div>
    </Modal>
  );
};

