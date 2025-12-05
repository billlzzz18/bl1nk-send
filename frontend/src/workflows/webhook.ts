import { neon } from "@neondatabase/serverless";

// === Step 1: ส่วนทำงาน (Worker) ===
// หน้าที่: บันทึกข้อมูลลง Neon DB
// ถ้าพัง (เช่น DB timeout) ระบบจะ Retry ให้อัตโนมัติ
export async function saveToDbStep(provider: string, payload: any) {
  "use step"; // Directive บอก Next.js ว่านี่คือ Step
  
  if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL");
  
  const sql = neon(process.env.DATABASE_URL);

  // บันทึกและคืนค่า ID
  const result = await sql`
    INSERT INTO webhook_inbound (provider, payload, status)
    VALUES (${provider}, ${payload}, 'processed_by_workflow')
    RETURNING id
  `;
  
  return result[0].id;
}

// === Workflow: ส่วนสั่งงาน (Orchestrator) ===
export async function handleWebhook(provider: string, payload: any) {
  "use workflow"; // Directive บอก Next.js ว่านี่คือ Workflow หลัก
  
  // เรียก Step ให้ทำงาน
  const savedId = await saveToDbStep(provider, payload);
  
  // (อนาคตถ้าจะเพิ่ม Step ส่ง AI หรือส่ง Email ก็มาเพิ่มบรรทัดต่อจากนี้ได้เลย)
  
  return { success: true, dbId: savedId };
}