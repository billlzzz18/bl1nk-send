import { start } from "workflow/api";
import { handleWebhook } from "@/workflows/webhook"; // เรียกไฟล์จริงที่เราเพิ่งสร้าง
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. ตรวจสอบความปลอดภัย (Security Check)
    const secret = req.headers.get("x-webhook-secret");
    if (secret !== process.env.WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. รับข้อมูล
    const body = await req.json();
    const provider = req.headers.get("x-provider") || "unknown";

    // 3. สั่ง Workflow เริ่มทำงาน (Fire and Forget)
    // ระบบจะตอบกลับ 200 ทันที โดยไม่รอให้ DB save เสร็จ (DB ทำงานเบื้องหลัง)
    await start(handleWebhook, [provider, body]);

    return NextResponse.json({ 
      accepted: true, 
      message: "Webhook processing started in background" 
    });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}