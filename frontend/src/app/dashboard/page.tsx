import { UserButton, auth } from "@clerk/nextjs";
import { sql } from "@/lib/db";

// บังคับให้หน้านี้ไม่ Cache (ข้อมูลเปลี่ยนตลอดเวลา)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) return <div>Access Denied</div>;

  // 1. ดึงข้อมูล 10 รายการล่าสุดจาก Neon
  // (สมมติว่าคุณสร้างตาราง webhook_inbound ตามที่คุยกันรอบก่อนแล้ว)
  let logs = [];
  try {
    logs = await sql`
      SELECT id, provider, payload, created_at 
      FROM webhook_inbound 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
  } catch (e) {
    console.error("DB Error:", e);
    // กรณีตารางยังไม่ถูกสร้าง หรือต่อผิด
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold">Webhook Monitor</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payload Preview</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No webhooks received yet (or DB connection failed)
                </td>
              </tr>
            ) : (
              logs.map((log: any) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {log.provider}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    {JSON.stringify(log.payload).substring(0, 50)}...
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
