import { sleep } from "workflow";
import { neon } from "@neondatabase/serverless";

// --- ส่วนของ Steps (ลูกน้อง) ---

// Step 1: บันทึกลง Neon (Inbound Log)
async function saveToDbStep(provider: string, payload: any) {
  "use step"; // สำคัญ! บอกว่าเป็น Step
  const sql = neon(process.env.DATABASE_URL!);
  const result = await sql`
    INSERT INTO webhook_inbound (provider, payload, status)
    VALUES (${provider}, ${payload}, 'processing')
    RETURNING id
  `;
  return result[0].id;
}

// Step 2: เรียก AI (งานหนัก)
async function analyzeAiStep(payload: any) {
  "use step";
  // เรียก Bedrock หรือ OpenAI ตรงนี้
  // ถ้า AI ล่ม หรือ Timeout มันจะ Retry ให้เอง!
  const analysis = await callBedrock(payload); 
  return analysis;
}

// Step 3: อัปเดตผลลัพธ์
async function updateResultStep(id: string, analysis: string) {
  "use step";
  const sql = neon(process.env.DATABASE_URL!);
  await sql`UPDATE webhook_inbound SET ai_analysis = ${analysis}, status = 'completed' WHERE id = ${id}`;
}

// --- ส่วนของ Workflow (ผู้จัดการ) ---

export async function handleWebhookWorkflow(provider: string, payload: any) {
  "use workflow"; // สำคัญ! บอกว่าเป็น Workflow
  
  // 1. รับเรื่อง
  const dbId = await saveToDbStep(provider, payload);
  
  // 2. ส่งให้ AI (อาจจะใช้เวลานาน)
  const analysis = await analyzeAiStep(payload);
  
  // 3. (Optional) รอสักหน่อย หรือทำอย่างอื่น
  // await sleep("1s"); 
  
  // 4. บันทึกผล
  await updateResultStep(dbId, analysis);
  
  return { status: "success", id: dbId };
}
