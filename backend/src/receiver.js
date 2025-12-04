module.exports.handler = async (event) => {
  // 1. ดึง IP และ Method (แบบปลอดภัย)
  const ip = event.requestContext?.http?.sourceIp || event.requestContext?.identity?.sourceIp || 'unknown';
  const method = event.requestContext?.http?.method || event.httpMethod;

  if (method !== 'POST') {
    return { 
      statusCode: 405, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  // 2. ดึง Secret แบบปลอดภัย (Safe Access)
  // แปลง Key เป็นตัวพิมพ์เล็กทั้งหมดก่อนหา เพราะบางทีส่งมาเป็น X-Webhook-Secret
  const headers = event.headers || {};
  const normalizedHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = headers[key];
    return acc;
  }, {});
  
  const incomingSecret = normalizedHeaders['x-webhook-secret'];
  const expectedSecret = process.env.WEBHOOK_SECRET; 

  if (incomingSecret !== expectedSecret) {
    console.warn(`[SECURITY WARN] Unauthorized attempt from IP: ${ip}`);
    return { 
      statusCode: 401, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized: Invalid Secret' }) 
    };
  }

  // 3. จัดการ Body (รองรับ Base64 ตามที่ CodeAnt แนะนำ)
  let payload;
  try {
    let bodyStr = event.body;
    if (event.isBase64Encoded) {
      bodyStr = Buffer.from(event.body, 'base64').toString('utf-8');
    }
    payload = JSON.parse(bodyStr);
  } catch (e) {
    console.warn(`[FORMAT WARN] Invalid JSON from IP: ${ip}`);
    return { 
      statusCode: 400, 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid JSON Format' }) 
    };
  }

  console.log("=== VALID WEBHOOK RECEIVED ===");
  console.log("Source IP:", ip);
  // console.log("Payload:", JSON.stringify(payload)); // Comment ออกถ้ากลัว Log ข้อมูลสำคัญ (PII)

  return {
    statusCode: 200,
    headers: { 
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json' // เพิ่ม Content-Type
    }, 
    body: JSON.stringify({ status: 'accepted', id: Date.now() }),
  };
};
