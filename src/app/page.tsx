import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>ברוכים הבאים לפרויקט ההזמנות</h1>
      <p>כדי להתחיל, בחר אחד מהדפים הבאים:</p>
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link href="/dashboard" style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: 'blue' }}>
          עבור לדאשבורד
        </Link>
        <Link href="/invite" style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', textDecoration: 'none', color: 'blue' }}>
          שלח הזמנה
        </Link>
      </div>
    </div>
  );
}