"use client";

import { useState, useEffect } from "react";
import ExportButton from "./ExportButton";
import ConfirmModal from "./ConfirmModal"; // Imported for delete confirmation
import EditModal from "./EditModal"; // Imported for editing RSVPs
import { Pencil, Trash2 } from "lucide-react";
import { INVITATION_CONFIG } from "../config";


interface RSVP {
  id: number;
  name: string;
  phone: string;
  guests: number;
  created_at: string;
}


// 📊 Dashboard - Main page component handling data fetch, state, and rendering the UI
export default function Dashboard() {
  const [data, setData] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Delete modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<RSVP | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState<RSVP | null>(null);
  const [saving, setSaving] = useState(false);

  const eventCategory = INVITATION_CONFIG.eventSubject || "אירוע מיוחד";

  // Fetch RSVPs from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/rsvp", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      const error = err as Error;

      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle delete operation via API
  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("מחיקה נכשלה");
      setData((prev) => prev.filter((item) => item.id !== id));
      setModalOpen(false);
      setSelectedDelete(null);
    } catch (err) {
      const error = err as Error;
      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  // Handle edit save via API
  const handleEditSave = async (values: {
    id: number;
    name: string;
    phone: string;
    guests: number;
  }) => {
    setSaving(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("שמירה נכשלה");
      const result = await response.json();
      const updated = result?.updated?.[0];
      if (updated) {
        setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      }
      setEditOpen(false);
      setSelectedEdit(null);
    } catch (err) {
        const error = err as Error;

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Calculate totals for stats
  const totalGuests = data.reduce((sum, item) => sum + (item.guests || 0), 0);
  const totalRSVPs = data.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-xl text-indigo-800 animate-pulse">
          טוען נתונים...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">שגיאה: </strong>
          {error}
        </div>
        <button
          onClick={fetchData}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          נסה שוב
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            {eventCategory}
          </h1>
          <div className="w-24 h-1 bg-indigo-400 mx-auto rounded"></div>
        </div>

        {/* Stats card */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-indigo-700">
                {totalRSVPs}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                אנשים אישרו הגעה
              </div>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl sm:text-5xl font-extrabold text-indigo-700">
                {totalGuests}
              </div>
              <div className="text-sm text-gray-600 mt-1">סה״כ אורחים</div>
            </div>
          </div>
        </div>

        {/* Title + export */}
        <div className="grid grid-cols-3 items-center mb-4">
          <div className="flex justify-start">
            <ExportButton data={data} />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 text-center">
            אישורי הגעה
          </h2>
        </div>

        {/* Table */}

<div className="bg-white rounded-xl shadow-lg overflow-hidden" dir="rtl">
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-indigo-50">
        <tr>
          <th className="px-4 py-3 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">
            שם
          </th>
          <th className="px-4 py-3 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">
            טלפון
          </th>
          <th className="px-4 py-3 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">
            מספר אורחים
          </th>
          <th className="px-4 py-3 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">
            תאריך
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <tr
            key={item.id}
            className="hover:bg-indigo-50 transition-colors duration-200"
          >
            {/* שם + אייקונים */}
<td className="px-4 py-3 relative">
  {/* השם מקבל padding ימני כדי לא לעלות על האייקונים */}
  <div className="text-sm font-medium text-gray-900 pr-20" dir="rtl">
    {item.name}
  </div>

  {/* אייקונים מימין עם צבעים */}
  <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-3">
    <button
      onClick={() => {
        setSelectedEdit(item);
        setEditOpen(true);
      }}
      aria-label="עריכה"
      className="text-indigo-600 hover:text-indigo-800"
    >
      <Pencil size={18} />
    </button>

    <button
      onClick={() => {
        setSelectedDelete(item);
        setModalOpen(true);
      }}
      aria-label="מחק"
      className="text-red-600 hover:text-red-800"
    >
      <Trash2 size={18} />
    </button>
  </div>
</td>





            {/* טלפון */}
            <td className="px-4 py-3 text-sm text-gray-500 text-center">
              {item.phone}
            </td>

            {/* מספר אורחים */}
            <td className="px-4 py-3 text-sm text-center">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                {item.guests}
              </span>
            </td>

            {/* תאריך בסוף */}
            <td className="px-4 py-3 text-sm text-gray-500 text-center">
              {new Date(item.created_at).toLocaleString("he-IL")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {data.length === 0 && (
    <div className="text-center py-12 text-gray-500">
      אין אישורי הגעה להצגה
    </div>
  )}
</div>
</div>

      {/* Modals - Rendered conditionally based on state */}
      <ConfirmModal
        open={modalOpen}
        title={`למחוק את ${selectedDelete?.name ?? "אישור ההגעה"}?`}
        description={
          selectedDelete
            ? `האם אתה בטוח שברצונך למחוק את אישור ההגעה של ${selectedDelete.name}?`
            : undefined
        }
        onCancel={() => {
          setModalOpen(false);
          setSelectedDelete(null);
        }}
        onConfirm={async () => {
          if (selectedDelete) await handleDelete(selectedDelete.id);
        }}
        loading={deleting}
      />
      <EditModal
        open={editOpen}
        item={selectedEdit}
        onSave={handleEditSave}
        onCancel={() => {
          setEditOpen(false);
          setSelectedEdit(null);
        }}
        loading={saving}
      />
    </main>
  );
}