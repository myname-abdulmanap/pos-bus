// ============================================
// VERCEL SERVERLESS FUNCTION - Webhook Handler
// ============================================
// File: api/webhook.js
// 
// Taruh file ini di folder /api/ di root project Anda
// Vercel akan otomatis deploy sebagai serverless function
// URL: https://your-domain.vercel.app/api/webhook

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse webhook data dari Cashi
    const { event, data } = req.body;

    console.log('📨 Webhook received:', { event, order_id: data?.order_id });

    // Validate webhook data
    if (!event || !data) {
      return res.status(400).json({ error: 'Invalid webhook data' });
    }

    // Handle webhook event
    if (event === 'PAYMENT_SETTLED') {
      
      // 1. HANDLE TEST WEBHOOK DARI DASHBOARD
      if (data.order_id && data.order_id.startsWith('TEST-')) {
        console.log('✅ Cashi Test Connection Received');
        return res.status(200).send('Test OK');
      }

      // 2. LOGIC TRANSAKSI ASLI
      if (data.status === 'SETTLED') {
        console.log('💰 Payment SETTLED:', {
          order_id: data.order_id,
          amount: data.amount,
          transaction_id: data.transaction_id
        });

        // ===================================
        // UPDATE DATABASE ANDA DI SINI
        // ===================================
        // Contoh dengan database:
        // await db.orders.update({
        //   where: { order_id: data.order_id },
        //   data: { 
        //     status: 'paid',
        //     transaction_id: data.transaction_id,
        //     paid_at: new Date()
        //   }
        // });

        // ===================================
        // KIRIM NOTIFIKASI (Opsional)
        // ===================================
        // - Email customer
        // - SMS notification
        // - Push notification
        // - Update real-time di frontend (WebSocket, Pusher, dll)

        // Untuk sekarang, kita log saja
        console.log('✅ Payment processed successfully');
        
        // Response OK ke Cashi
        return res.status(200).send('OK');
      } else {
        console.log('⚠️ Payment status:', data.status);
        return res.status(200).send('OK');
      }
    }

    // Event type lain
    console.log('ℹ️ Other event type:', event);
    return res.status(200).send('OK');

  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// ============================================
// CATATAN DEPLOYMENT
// ============================================
// 1. Buat folder /api/ di root project
// 2. Simpan file ini sebagai /api/webhook.js
// 3. Deploy ke Vercel
// 4. Webhook URL: https://your-domain.vercel.app/api/webhook
// 5. Daftarkan URL ini di dashboard Cashi
//
// TESTING:
// curl -X POST https://your-domain.vercel.app/api/webhook \
//   -H "Content-Type: application/json" \
//   -d '{"event":"PAYMENT_SETTLED","data":{"order_id":"TEST-001","status":"SETTLED","amount":10000}}'