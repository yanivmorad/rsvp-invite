// C:\Users\yc\rsvp-invite\src\app\page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Calendar, Users, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Home() {
  const [dashboardToken, setDashboardToken] = useState('');
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // בודק אם כבר יש cookie קיים של טוקן
  useEffect(() => {
    const cookies = document.cookie.split(';').map((c) => c.trim());
    const tokenCookie = cookies.find((c) => c.startsWith('dashboardToken='));
    if (tokenCookie) {
      setIsTokenValid(true);
    }
  }, []);

  const handleTokenSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // שומר את מה שהמשתמש הזין ב־cookie
      document.cookie = `dashboardToken=${dashboardToken}; path=/;`;
      setIsTokenValid(true);
      window.location.href = '/dashboard';
      setIsLoading(false);
    }, 800);
  };

  const handleInviteClick = () => {
    window.location.href = '/invite';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      {/* רקע אנימציה */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* כותרת */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-white/10 backdrop-blur-lg rounded-full border border-white/20">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            מערכת הזמנות לאירועים
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            ניהול מתקדם של אירועים והזמנות עם ממשק חכם ואינטואיטיבי
          </p>
        </div>

        {/* כרטיסים */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Dashboard */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 mx-auto">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">פאנל ניהול</h2>
            <p className="text-white/70 text-center mb-6 leading-relaxed">
              גישה למערכת הניהול המתקדמת - דורש הרשאה מיוחדת
            </p>

            {!isTokenValid && (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={dashboardToken}
                    onChange={(e) => setDashboardToken(e.target.value)}
                    placeholder="הזן טוקן גישה..."
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                    onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {isTokenValid === false && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    <p className="text-red-300 text-sm">
                      מצטערים, הטוקן שהוזן אינו נכון. אנא פנה למנהל המערכת לקבלת טוקן חדש.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleTokenSubmit}
                  disabled={isLoading || !dashboardToken.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      מאמת...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      כניסה לפאנל
                    </>
                  )}
                </button>
              </div>
            )}

            {isTokenValid === true && (
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-green-300 text-sm">אומת בהצלחה!</p>
                </div>
                <button
                  onClick={() => (window.location.href = '/dashboard')}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  עבור לדשבורד
                </button>
              </div>
            )}
          </div>

          {/* Invite */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mb-6 mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-4">שליחת הזמנות</h2>
            <p className="text-white/70 text-center mb-8 leading-relaxed">
              שלח הזמנות מעוצבות ומותאמות אישית למוזמנים שלך
            </p>
            <button
              onClick={handleInviteClick}
              className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <Users className="w-5 h-5" />
              שלח הזמנה חדשה
            </button>
          </div>
        </div>

        {/* פיצ'רים */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-white font-semibold mb-2">ניהול חכם</h3>
            <p className="text-white/60 text-sm">מערכת ניהול מתקדמת לאירועים</p>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-white font-semibold mb-2">הזמנות מותאמות</h3>
            <p className="text-white/60 text-sm">עיצוב והתאמה אישית מלאה</p>
          </div>
          <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-white font-semibold mb-2">מעקב בזמן אמת</h3>
            <p className="text-white/60 text-sm">מעקב אחר תגובות והרשמות</p>
          </div>
        </div>
      </div>
    </div>
  );
}
