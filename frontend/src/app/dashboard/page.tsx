import { auth } from '@clerk/nextjs/server';
import { sql } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';

// บังคับให้โหลดข้อมูลใหม่ทุกครั้ง (ไม่ Cache)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. ตรวจสอบสิทธิ์ (Server-side Auth)
  const { userId } = await auth();
  if (!userId) return <div className="p-10">Access Denied: Please Login</div>;

  // 2. ดึงข้อมูลจาก Neon (SQL Query)
  // หมายเหตุ: ตรวจสอบว่าใน Neon คุณสร้างตาราง 'webhook_inbound' หรือยัง
  // ถ้ายังไม่มีตาราง มันจะ Error ว่า relation does not exist
  let logs: any[] = [];
  try {
    logs = await sql`
      SELECT * FROM webhook_inbound 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
  } catch (error) {
    console.error("Database Error:", error);
    // กรณีนี้มักเกิดจากยังไม่ได้สร้างตาราง หรือ Connection String ผิด
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Blink Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Admin Mode</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Webhooks</h2>
          <p className="text-gray-500">Monitoring real-time data from Android Tunnel</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payload</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                    {logs === null ? 'Database Connection Failed' : 'No logs found yet.'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">
                      {log.provider || 'unknown'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono max-w-xs truncate">
                      {JSON.stringify(log.payload)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}