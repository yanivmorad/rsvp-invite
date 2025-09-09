import { supabaseAdmin } from '@/lib/supabaseAdmin';
import ExportButton from './ExportButton';
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export interface RSVP {
  id: string;
  name: string;
  phone: string;
  guests: number;
  created_at: string;
}

export const metadata: Metadata = {
  title: "RSVP - Dashboard",
  description: "Manage your invitations and RSVPs",
};
export default async function Dashboard() {
  // נניח שזה הקטגוריה שתסופק בהמשך
  const eventCategory = "אירוע החתונה של שירה ואיתי";
  
  try {
    const { data, error } = await supabaseAdmin
      .from('rsvp')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return (
        <div className="p-6 max-w-3xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">שגיאה: </strong>
            {error.message}
          </div>
        </div>
      );
    }

    // חישוב סיכום אורחים
    const totalGuests = data ? data.reduce((sum, item) => sum + item.guests, 0) : 0;
    const totalRSVPs = data?.length || 0;

    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-5xl mx-auto">
          {/* כותרת האירוע */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-indigo-800 mb-2">{eventCategory}</h1>
            <div className="w-24 h-1 bg-indigo-400 mx-auto"></div>
          </div>

          {/* סיכום */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-around items-center text-center">
              <div className="mb-4 md:mb-0">
                <div className="text-3xl font-bold text-indigo-700">{totalRSVPs}</div>
                <div className="text-gray-600">אנשים אישרו הגעה</div>
              </div>
              <div className="hidden md:block h-12 w-px bg-gray-200"></div>
              <div>
                <div className="text-3xl font-bold text-indigo-700">{totalGuests}</div>
                <div className="text-gray-600">סה"כ אורחים</div>
              </div>
            </div>
          </div>

          {/* פקד ייצוא ונתונים */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">אישורי הגעה</h2>
            <ExportButton data={data || []} />
          </div>

          {/* טבלה */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-6 py-4 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">תאריך</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">מספר אורחים</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">טלפון</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-indigo-800 uppercase tracking-wider">שם</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(data || []).map((item: RSVP) => (
                    <tr key={item.id} className="hover:bg-indigo-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        {new Date(item.created_at).toLocaleString('he-IL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                          {item.guests}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {(!data || data.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                אין אישורי הגעה להצגה
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (err) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">שגיאה: </strong>
          Failed to initialize Supabase client. Please check your environment variables.
        </div>
      </div>
    );
  }
}