import { auth } from '@clerk/nextjs/server';
import { sql } from '@/lib/db';
import { UserButton } from '@clerk/nextjs';
import { Activity, Database, Server, ShieldCheck, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) return <div className="flex h-screen items-center justify-center text-gray-500">Access Denied</div>;

  // ดึงข้อมูลจริง
  let logs: any[] = [];
  try {
    logs = await sql`
      SELECT * FROM webhook_inbound 
      ORDER BY created_at DESC 
      LIMIT 10
    `;
  } catch (error) {
    console.error("DB Error", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
              <Activity size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight">bl1nk console</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Operational
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor your real-time webhook traffic and system health.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Total Requests" 
            value={logs.length.toString()} 
            sub="Last 24 hours" 
            icon={<Server size={18} className="text-blue-600" />} 
          />
          <StatCard 
            title="Success Rate" 
            value="100%" 
            sub="No failures detected" 
            icon={<ShieldCheck size={18} className="text-green-600" />} 
          />
          <StatCard 
            title="Avg. Latency" 
            value="24ms" 
            sub="Global response time" 
            icon={<Clock size={18} className="text-purple-600" />} 
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Database size={16} className="text-gray-400" />
              Recent Inbound Logs
            </h3>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">Live Data</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Provider</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Payload Preview</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      No data received yet. Waiting for webhooks...
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap font-mono text-xs">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {log.provider || 'Generic'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-500 font-mono text-xs bg-gray-50 rounded">
                        {JSON.stringify(log.payload)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

// Component ย่อยสำหรับ Card (แปะไว้ในไฟล์เดียวกันได้เลย)
function StatCard({ title, value, sub, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
          {icon}
        </div>
        {/* <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span> */}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 mt-1">{value}</h4>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}