// File: api/check-payment.js
// Untuk mengecek status pembayaran

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order_id } = req.query;

    if (!order_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'order_id is required' 
      });
    }

    // Call Cashi API to check payment status
    // Endpoint yang benar: https://cashi.id/api/check-status/:orderId
    const response = await fetch(`https://cashi.id/api/check-status/${order_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'CASHI-EOHPDT0ETJI' // <<<< GANTI DENGAN API KEY ANDA
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashi Check Status Error:', data);
      return res.status(response.status).json({
        success: false,
        message: data.message || 'Status check failed',
        details: data
      });
    }

    // Return response to frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}