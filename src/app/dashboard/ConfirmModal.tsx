"use client";

import { useEffect, useRef } from "react";

// 🗑️ Confirm Delete Modal - Handles confirmation for deleting an RSVP entry
export default function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        ref={ref}
        tabIndex={-1}
        className="relative z-10 w-[min(92%,480px)] bg-white rounded-2xl shadow-xl p-6 mx-4"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mb-6">{description}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            בטל
          </button>
          <button
            onClick={async () => await onConfirm()}
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "מוחק..." : "מחק"}
          </button>
        </div>
      </div>
    </div>
  );
}