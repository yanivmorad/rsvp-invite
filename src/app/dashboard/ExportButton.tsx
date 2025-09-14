"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

type RSVP = {
  id: number;
  name: string;
  phone: string;
  guests: number;
  created_at: string;
};

export default function ExportButton({ data }: { data: RSVP[] }) {
  const [exporting, setExporting] = useState(false);

  const exportToExcel = async () => {
    if (!data || data.length === 0) return;
    try {
      setExporting(true);

      const headers = ["שם", "טלפון", "מספר אורחים", "תאריך"];
      const worksheetData: (string | number)[][] = [
        headers,
        ...data.map((item) => [
          item.name ?? "",
          item.phone ?? "",
          item.guests ?? 0,
          new Date(item.created_at).toLocaleString("he-IL"),
        ]),
      ];

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

      // רוחב עמודות אוטומטי לתצוגה נאה בקובץ
      const colWidths = headers.map((_, colIndex) => {
        let max = 10;
        for (let r = 0; r < worksheetData.length; r++) {
          const v = worksheetData[r][colIndex];
          const len = v == null ? 0 : String(v).length;
          if (len > max) max = len;
        }
        return { wch: Math.min(Math.max(max, 10), 40) };
      });
      worksheet["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, "אישורי הגעה");

      const date = new Date().toLocaleDateString("he-IL"); // שם ידידותי בעברית
      const filename = `אישורי_הגעה_${date}.xlsx`;

      // הפונקציה שמייצרת ומורידה קובץ Excel (.xlsx)
      XLSX.writeFile(workbook, filename);
    } catch (err) {
      console.error("Export to Excel failed:", err);
      alert("שגיאה ביצוא לקובץ Excel. בדוק את הקונסול לפרטים.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={exportToExcel}
      disabled={exporting || !data || data.length === 0}
      className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1
        ${exporting || !data || data.length === 0 ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"}
      `}
      title={data && data.length > 0 ? "ייצא לאקסל" : "אין נתונים לייצוא"}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 12v8M8 8l4-4 4 4" />
      </svg>
      <span>{exporting ? "מייצא..." : "ייצא לאקסל"}</span>
    </button>
  );
}
