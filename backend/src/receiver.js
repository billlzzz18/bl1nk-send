module.exports.handler = async (event) => {
  // 1. ปรับการดึง IP (สำหรับ httpApi)
  const ip = event.requestContext?.http?.sourceIp || event.requestContext?.identity?.sourceIp || 'unknown';
  
  // 2. ปรับการดึง Method (สำหรับ httpApi)
  // httpApi จะเก็บ Method ไว้ใน event.requestContext.http.method
  const method = event.requestContext?.http?.method || event.httpMethod;

  if (method !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  // 3. กรอง Authentication (เหมือนเดิม)
  const incomingSecret = event.headers['x-webhook-secret'];
  const expectedSecret = process.env.WEBHOOK_SECRET; 

  if (incomingSecret !== expectedSecret) {
    console.warn(`[SECURITY WARN] Unauthorized attempt from IP: ${ip}`);
    return { 
      statusCode: 401, 
      body: JSON.stringify({ error: 'Unauthorized: Invalid Secret' }) 
    };
  }

  // 4. กรอง Payload (เหมือนเดิม)
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    console.warn(`[FORMAT WARN] Invalid JSON from IP: ${ip}`);
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON Format' }) };
  }

  console.log("=== VALID WEBHOOK RECEIVED ===");
  console.log("Source IP:", ip);
  console.log("Payload:", JSON.stringify(payload, null, 2));

  return {
    statusCode: 200,
    // httpApi จัดการ CORS ให้อัตโนมัติ แต่ใส่ไว้ก็ไม่เสียหาย
    headers: { 'Access-Control-Allow-Origin': '*' }, 
    body: JSON.stringify({ status: 'accepted', id: Date.now() }),
  };
};
