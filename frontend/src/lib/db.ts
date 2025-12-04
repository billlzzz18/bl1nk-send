import { neon } from '@neondatabase/serverless';

// บังคับว่าต้องมี URL นี้ใน Environment Variables ของ Vercel
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export const sql = neon(process.env.DATABASE_URL);
