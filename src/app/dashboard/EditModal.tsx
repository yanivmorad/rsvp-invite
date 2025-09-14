"use client";

import { useState, useEffect } from "react";

interface RSVP {
  id: number;
  name: string;
  phone: string;
  guests: number;
  created_at: string;
}

// ✏️ Edit Modal - Handles editing an existing RSVP entry with form inputs
export default function EditModal({
  open,
  item,
  onSave,
  onCancel,
  loading,
}: {
  open: boolean;
  item: RSVP | null;
  onSave: (values: {
    id: number;
    name: string;
    phone: string;
    guests: number;
  }) => Promise<void> | void;
  onCancel: () => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState({ name: "", phone: "", guests: 1 });

  useEffect(() => {
    if (item) {
      setForm({ name: item.name, phone: item.phone, guests: item.guests });
    }
  }, [item]);

  if (!open || !item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 w-[min(92%,480px)] bg-white rounded-2xl shadow-xl p-6 mx-4">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">
          עריכת אישור הגעה
        </h3>
        <div className="flex flex-col gap-4" dir="rtl">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2  text-indigo-500"
            placeholder="שם"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2  text-indigo-500"
            placeholder="טלפון"
          />
          <input
            type="number"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="border rounded-lg px-3 py-2  text-indigo-500"
            placeholder="מספר אורחים"
            min={1}
            max={20}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            בטל
          </button>
          <button
            onClick={() =>
              onSave({ id: item.id, ...form, guests: Number(form.guests) })
            }
            disabled={loading}
            className={`px-4 py-2 rounded-md font-medium text-white ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-800"
            }`}
          >
            {loading ? "שומר..." : "שמור"}
          </button>
        </div>
      </div>
    </div>
  );
}