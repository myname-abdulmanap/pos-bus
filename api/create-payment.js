// File: api/create-payment.js
// Letakkan di folder /api di root project Vercel Anda

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { order_id, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'order_id and amount are required' 
      });
    }

    // Call Cashi API from server-side (no CORS issue)
    const response = await fetch('https://cashi.id/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': 'CASHI-EOHPDT0ETJI' // Set ini di Vercel Environment Variables
      },
      body: JSON.stringify({
        order_id,
        amount
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Cashi API Error:', data);
      return res.status(response.status).json({
        success: false,
        message: data.message || 'Payment creation failed',
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