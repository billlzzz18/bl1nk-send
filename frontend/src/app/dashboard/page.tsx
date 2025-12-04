import { UserButton, auth } from "@clerk/nextjs";

export default function DashboardPage() {
  const { userId } = auth();

  if (!userId) return <div>Not signed in</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px' }}>
        <p>User ID: {userId}</p>
        <p style={{ color: 'green', fontWeight: 'bold' }}>System Status: Online</p>
      </div>
    </div>
  );
}
