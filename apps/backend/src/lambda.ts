import { createApp } from "./index";
import { loadConfig } from "./config";       
import { getPrisma } from "../prisma/dbPostgres"; 

// 🌟 OPTIMASI COLD START: Simpan state di luar handler
let app: ReturnType<typeof createApp>;
let isConfigLoaded = false;

export const handler = async (event: any) => {
  try {
    // 1. EKSTRAKSI AMAN (Mencegah TypeError jika AWS mengubah format struktur root event)
    const method = event.requestContext?.http?.method || event.httpMethod || "GET";
    const rawPath = event.rawPath || event.path || "/";
    const rawQueryString = event.rawQueryString ? `?${event.rawQueryString}` : "";
    
    // DEBUG: Logging esensial saja agar CloudWatch tidak bengkak
    console.log(`[REQUEST] ${method} ${rawPath}`);

    // 2. LOAD CONFIG SEKALI SAJA (Idempotent)
    if (!isConfigLoaded) {
      await loadConfig();
      isConfigLoaded = true;
    }

    // 3. INISIALISASI APP (Hanya jika belum ada)
    if (!app) {
      app = createApp();
    }

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // 4. MANUAL CORS INTERCEPTOR UNTUK PREFLIGHT
    if (method === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin": frontendUrl,
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400", // Cache preflight selama 24 jam di browser
        },
        body: "",
      };
    }

    // 5. REKONSTRUKSI URL DENGAN FALLBACK
    // (Header Host kadang ditulis huruf besar/kecil oleh AWS/CloudFront)
    const host = event.headers?.host || event.headers?.Host || "localhost";
    const url = `https://${host}${rawPath}${rawQueryString}`;

    // 6. VALIDASI STRICT FETCH API (GET/HEAD pantang memiliki body)
    const isBodyAllowed = !["GET", "HEAD"].includes(method);
    let requestBody: string | Buffer | undefined = undefined;

    if (isBodyAllowed && event.body) {
      requestBody = event.isBase64Encoded 
        ? Buffer.from(event.body, "base64") 
        : event.body;
    }

    // 7. JALANKAN ELYSIA
    const request = new Request(url, {
      method: method,
      headers: new Headers(event.headers as Record<string, string>),
      body: requestBody,
    });

    const response = await app.handle(request);

    // 8. INJECT CORS KE RESPONSE UTAMA 
    // (Menggunakan .entries() untuk memastikan format header terbaca aman)
    const finalHeaders = Object.fromEntries(response.headers.entries());
    finalHeaders["Access-Control-Allow-Origin"] = frontendUrl;
    finalHeaders["Access-Control-Allow-Credentials"] = "true";

    return {
      statusCode: response.status,
      headers: finalHeaders,
      body: await response.text(),
      isBase64Encoded: false,
    };

  } catch (error: any) {
    // 9. JARING PENGAMAN TERAKHIR
    console.error("[FATAL ERROR] Handler jebol:", error);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*" // Pastikan error tetap bisa dibaca frontend
      },
      body: JSON.stringify({
        error: "Internal Server Error Lambda Wrapper",
        message: error.message
      })
    };
  }
};