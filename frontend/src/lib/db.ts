import { neon } from '@neondatabase/serverless';

// ถ้าไม่มี URL ให้แจ้งเตือน (กันลืมใส่ใน Vercel)
if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL environment variable');
}

// สร้าง Connection
export const sql = neon(process.env.DATABASE_URL);