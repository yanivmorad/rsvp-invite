"use client";

import { RSVP } from "@/app/dashboard/page";
import * as XLSX from 'xlsx';

export default function ExportButton({ data }: { data: RSVP[] }) {
  const exportToExcel = () => {
    if (data.length === 0) return;
    
    // יצירת דאטה בפורמט מתאים
    const worksheetData = [
      ['שם', 'טלפון', 'מספר אורחים', 'תאריך'],
      ...data.map(item => [
        item.name,
        item.phone,
        item.guests,
        new Date(item.created_at).toLocaleString('he-IL')
      ])
    ];

    // יצירת workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // הוספת worksheet ל-workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'אישורי הגעה');

    // הורדת הקובץ
    XLSX.writeFile(workbook, `אישורי_הגעה_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={data.length === 0}
      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      ייצא לאקסל
    </button>
  );
}