// src/app/invite/config.ts

export const INVITATION_CONFIG = {
  eventTitle: "בְּסִּימָן טוֹב בֵּן בָּא לָנוּ\nבְּיָמָיו יָבוֹא הַגּוֹאֵל", // טקסט פתיחה בראש ההזמנה
  eventSubject: "הברית של יוסי וחנה", // נושא האירוע ליומן Google (קריטי)
  familyNames: "יוסי וחנה אברגל", // שמות ההורים להזמנה
  eventDateHebrew: "כ\"ז תמוז התשפ\"ה", // תאריך עברי (להצגה בלבד)
  eventDateGregorian: "23-07-2025", // תאריך לועזי DD-MM-YYYY (קריטי ליומן)
  eventDay: "יום רביעי", // יום בשבוע להצגה בהזמנה
  venueName: "טירה על הים", // שם האולם/מקום האירוע
  venueAddress: "מפקורה 2, אשדוד, ישראל", // כתובת מלאה (קריטי ל-Waze וליומן)
  venueDetails: "קבלת פנים - 18:30", // פרטים נוספים + שעת התחלה (קריטי ליומן אם לא נגדיר שעה אחרת)
  
  venueCoords: { // נקודות ציון ברירת מחדל (קריטי ל-Waze)
    lat: 31.807194, // קו רוחב
    lng: 34.642652, // קו אורך
  },

  colors: { // צבעי עיצוב להזמנה
    primary: '#2f4050', 
    secondary: '#e8c8af',
    accent: '#ffd700',
    backgroundGradient: { from: '#cfe8f7', to: '#e5d0bf' },
    buttonGradient: { from: '#2f4050', to: '#1e2a36' },
    buttonHoverGradient: { from: '#3b4d63', to: '#141c24' }
  },

  images: {
    background: '/baby_photo.avif' // תמונת רקע להזמנה
  },

  messages: { // טקסטים קבועים להזמנה ול־RSVP
    mainHeader: "בשבח והודיה להשם יתברך אנו שמחים להזמין אתכם לאירוע ברית המילה של בננו היקר", // טקסט מרכזי בראש הדף
    closing: "נשמח מאוד לראותכם ולחגוג יחד איתכם!", // טקסט סיום מתחת לפרטים
   
  }
};
