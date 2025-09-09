// src/app/invite/utils.ts
import { INVITATION_CONFIG } from "./config";

type CalendarOpts = { title?: string; details?: string; location?: string };

function parseEventDateTime(): { start: string; end: string } {
  // פורמט: DD-MM-YYYY
  const [day, month, year] = INVITATION_CONFIG.eventDateGregorian.split("-").map(Number);

  // חיפוש שעה מתוך venueDetails (נניח "18:30")
  const timeMatch = INVITATION_CONFIG.venueDetails.match(/(\d{1,2}):(\d{2})/);
  const hour = timeMatch ? parseInt(timeMatch[1], 10) : 18;
  const minute = timeMatch ? parseInt(timeMatch[2], 10) : 30;

  const startDate = new Date(year, month - 1, day, hour, minute);
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // ברירת מחדל: שעתיים

  // המרה לפורמט YYYYMMDDTHHmmss
  const toCalendarFormat = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return {
    start: toCalendarFormat(startDate),
    end: toCalendarFormat(endDate),
  };
}

export const buildGoogleCalendarUrl = (opts: CalendarOpts = {}): string => {
  const { title, details, location } = opts;
  const base = "https://www.google.com/calendar/render?action=TEMPLATE";

  const { start, end } = parseEventDateTime();

  const params = new URLSearchParams({
    text: title ?? INVITATION_CONFIG.eventSubject,
    location: location ?? INVITATION_CONFIG.venueAddress,
    dates: `${start}/${end}`, // 👈 מוסיפים טווח תאריכים
  }).toString();

  return `${base}&${params}`;
};

export const buildWazeUrl = (addressOrCoords?: string): string => {
  const coords = INVITATION_CONFIG.venueCoords;
  if (coords?.lat != null && coords?.lng != null) {
    return `https://waze.com/ul?ll=${coords.lat},${coords.lng}&navigate=yes`;
  }
  return `https://waze.com/ul?q=${encodeURIComponent(addressOrCoords ?? INVITATION_CONFIG.venueAddress)}`;
};
