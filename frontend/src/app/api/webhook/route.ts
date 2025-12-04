import { start } from "workflow/api";
import { handleWebhookWorkflow } from "@/workflows/process-webhook";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const provider = req.headers.get("x-provider") || "unknown";

  // สั่งเริ่มงานแบบ Async (ไม่รอเสร็จ ตอบกลับเลยทันที)
  await start(handleWebhookWorkflow, [provider, body]);

  return NextResponse.json({ message: "Webhook received, processing in background" });
}
