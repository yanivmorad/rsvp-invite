//C:\Users\yc\rsvp-invite\src\app\invite\page.tsx
'use client';

import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { FiMapPin, FiCalendar } from "react-icons/fi";
import { SiWaze } from "react-icons/si";

import { INVITATION_CONFIG } from "../config";
import { buildGoogleCalendarUrl, buildWazeUrl } from "./utils";

type Status = 'idle' | 'ok' | 'error';
export default function BrisInvite() {
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [guests, setGuests] = useState<number>(1);
  const [status, setStatus] = useState<Status>('idle');
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setShowConfetti(true);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');

    const res = await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, phone, guests }),
    });

    setStatus(res.ok ? 'ok' : 'error');
    if (res.ok) {
      setName('');
      setPhone('');
      setGuests(1);
    }
  }

const drawSmallConfetti = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.fillRect(0, 0, 12, 10);
  ctx.fill();
};

// פונקציה מותאמת למובייל
const drawMobileConfetti = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.fillRect(0, 0, 9, 7); // גודל מוקטן למובייל
  ctx.fill();
};

return (
<div
  className="min-h-screen"
  style={{
    backgroundImage: `linear-gradient(135deg, ${INVITATION_CONFIG.colors.backgroundGradient.to} 0%,  ${INVITATION_CONFIG.colors.backgroundGradient.to} 15%,  ${INVITATION_CONFIG.colors.backgroundGradient.from} 200%)`
  }}
>
  <div className="max-w-2xl mx-auto">
    <div className="relative">
      {isClient && showConfetti && (
        <>
          {/* קונפטי רגיל למסכים גדולים - מוסתר במובייל */}
          <div className="hidden md:block">
            <Confetti
              recycle={true}
              numberOfPieces={150}
              colors={[INVITATION_CONFIG.colors.primary, INVITATION_CONFIG.colors.accent]}
              className="absolute top-0 left-0 w-full h-[60vh] z-20"
              drawShape={drawSmallConfetti}
              gravity={0.03}
            />
          </div>
          
          {/* קונפטי קטן למובייל - מוסתר במסכים גדולים */}
          <div className="md:hidden">
            <Confetti
              recycle={true}
              numberOfPieces={200}
              colors={[INVITATION_CONFIG.colors.primary, INVITATION_CONFIG.colors.accent]}
              className="absolute top-0 left-0 w-full h-[50vh] z-20"
              drawShape={drawMobileConfetti}
              gravity={0.025}
            />
          </div>
        </>
      )}

      {/* ===== Header ===== */}
      <header className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* תמונת רקע למסכים גדולים */}
        <div 
          className="hidden xs:block absolute inset-0 w-full bg-cover bg-center"
          style={{ backgroundImage: `url('${INVITATION_CONFIG.images.background}')` }}
          aria-hidden="true"
        />
        
        {/* תמונת רקע למסכים קטנים */}
        <div 
          className="xs:hidden absolute inset-0 w-full bg-cover bg-top"
          style={{ 
            backgroundImage: `url('${INVITATION_CONFIG.images.background}')`,
            height: '60vh', 
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
          }}
          aria-hidden="true"
        />
        
        {/* תוכן מרכזי */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 w-full px-4">
          <div className="text-center" dir="rtl">
            <h1 
              className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-lg"
              style={{ fontFamily: 'Varela Round, sans-serif', color: INVITATION_CONFIG.colors.primary }}
            >
              {INVITATION_CONFIG.eventTitle}
            </h1>
          </div>
        </div>
        
        {/* גרדיאנט מעל התמונה */}
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent, transparent, ${INVITATION_CONFIG.colors.secondary}66)` }}
        />
      </header>
    </div>

    {/* ===== Content Section ===== */}
    <div className="py-8 md:py-16 px-4 md:px-8 bg-white/80 backdrop-blur-md shadow-xl rounded-b-3xl">

      <div className="text-center mb-8 md:mb-12" dir="rtl" style={{ fontFamily: 'Heebo, sans-serif' }}>
        <p
          className="text-lg md:text-xl font-bold mb-2 md:mb-4 tracking-wide"
          style={{ color: INVITATION_CONFIG.colors.primary }}
        >
          {INVITATION_CONFIG.messages.mainHeader}
        </p>

        <div className="mt-4 md:mt-8 space-y-1 md:space-y-2" style={{ color: INVITATION_CONFIG.colors.primary }}>
          <p className="font-bold text-2xl md:text-4xl" style={{ fontFamily: 'Varela Round, sans-serif' }}>
            {INVITATION_CONFIG.eventDay} - {INVITATION_CONFIG.eventDateHebrew}
          </p>
          <p className="text-xl md:text-4xl text-gray-600">{INVITATION_CONFIG.eventDateGregorian}</p>     
          <p className="font-bold mt-2 md:mt-4 text-lg md:text-2xl ">{INVITATION_CONFIG.venueName}</p>

          <div className="flex items-center justify-center gap-2 md:gap-3 mt-1 md:mt-2 text-gray-600">
            <FiMapPin
              className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0"
              style={{ color: INVITATION_CONFIG.colors.primary }}
              aria-hidden="true"
            />
            <p className="text-lg md:text-lg text-right">{INVITATION_CONFIG.venueAddress}</p>
          </div>

          <p className="mt-2 md:mt-3 text-lg md:text-xl text-gray-700">{INVITATION_CONFIG.venueDetails}</p>
        </div>

        <p className="mt-6 md:mt-10 text-lg md:text-2xl font-semibold" style={{ color: INVITATION_CONFIG.colors.secondary }}>
          {INVITATION_CONFIG.messages.closing}
        </p>
        <p className="font-semibold text-3xl md:text-4xl mt-2" style={{ color: INVITATION_CONFIG.colors.primary }}>
          {INVITATION_CONFIG.familyNames}
        </p>
      </div>

      {/* Action bar: Google Calendar + Waze */}
      <div className="mt-6 md:mt-8 mb-10 flex flex-row flex-wrap items-center justify-center gap-2 md:gap-3">  
        <a
          href={buildGoogleCalendarUrl({})}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow hover:opacity-90 transition"
          style={{
            background: `linear-gradient(to right, ${INVITATION_CONFIG.colors.buttonGradient.from}, ${INVITATION_CONFIG.colors.buttonGradient.to})`,
            color: "#fff",
          }}
          aria-label="הוספת האירוע ליומן Google"
        >
          <FiCalendar className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm md:text-base">הוסף ליומן</span>
        </a>

        <a
          href={buildWazeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium border shadow hover:opacity-90 transition"
          style={{
            borderColor: INVITATION_CONFIG.colors.primary,
            color: INVITATION_CONFIG.colors.primary,
            background: "transparent",
          }}
          aria-label="ניווט עם Waze"
        >
          <SiWaze className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm md:text-base">ניווט בוויז</span>
        </a>
      </div>

      {/* Divider */}
      <div className="border-t pt-6 md:pt-10" style={{ borderColor: INVITATION_CONFIG.colors.secondary }}>
        <h3 className="text-lg md:text-xl font-medium text-center text-gray-700 mb-4 md:mb-6">
          אנא אשרו הגעה
        </h3>

        {/* Form */}
        <form onSubmit={submit} className="space-y-6" dir="rtl">
          {/* שם + טלפון */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-medium mb-1 text-right"
                style={{ color: INVITATION_CONFIG.colors.primary }}
              >
                שם מלא
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 text-right"
                placeholder="הזן את שמך המלא"
                style={{ 
                  color: INVITATION_CONFIG.colors.primary,
                  borderColor: INVITATION_CONFIG.colors.secondary,
                  outlineColor: INVITATION_CONFIG.colors.secondary
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium mb-1 text-right"
                style={{ color: INVITATION_CONFIG.colors.primary }}
              >
                מספר טלפון
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 text-right"
                placeholder="הזן מספר טלפון"
                style={{ 
                  color: INVITATION_CONFIG.colors.primary,
                  borderColor: INVITATION_CONFIG.colors.secondary,
                  outlineColor: INVITATION_CONFIG.colors.secondary
                }}
              />
            </div>
          </div>

          {/* מספר משתתפים */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">כמה תגיעו?</p>

            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-full font-bold shadow transition"
                style={{ backgroundColor: INVITATION_CONFIG.colors.secondary, color: "#333" }}
              >
                −
              </button>

              <span className="text-lg font-semibold text-gray-800 w-16 text-center">{guests}</span>

              <button
                type="button"
                onClick={() => setGuests(guests + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-full font-bold shadow transition"
                style={{ backgroundColor: INVITATION_CONFIG.colors.secondary, color: "#333" }}
              >
                +
              </button>
            </div>
          </div>

          {/* כפתור שליחה */}
          <div>
            <button
              type="submit"
              className="w-full text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200"
              style={{ 
                background: `linear-gradient(to right, ${INVITATION_CONFIG.colors.buttonGradient.from}, ${INVITATION_CONFIG.colors.buttonGradient.to})`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${INVITATION_CONFIG.colors.buttonHoverGradient.from}, ${INVITATION_CONFIG.colors.buttonHoverGradient.to})`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = `linear-gradient(to right, ${INVITATION_CONFIG.colors.buttonGradient.from}, ${INVITATION_CONFIG.colors.buttonGradient.to})`;
              }}
            >
              אשר הגעה
            </button>
          </div>
        </form>

        {/* Status Messages */}
        {status === 'ok' && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center">
            תודה! הפרטים נקלטו בהצלחה. נתראה בשמחה!
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            אירעה שגיאה בשליחת הפרטים. אנא נסה שוב.
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  );
}