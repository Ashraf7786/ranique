const fs = require('fs');
const path = require('path');
try {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      process.env[key] = value;
    }
  });
} catch (e) {
  console.log('No .env found or failed to parse manually:', e.message);
}

const token = process.env.DELHIVERY_API_TOKEN;
const baseUrl = process.env.DELHIVERY_BASE_URL || 'https://track.delhivery.com';
const pickupLocation = process.env.DELHIVERY_PICKUP_LOCATION || 'Primary_Warehouse';

console.log('Using Delhivery Config:');
console.log('Base URL:', baseUrl);
console.log('Pickup Location:', pickupLocation);
console.log('Token (first 8 chars):', token ? token.substring(0, 8) + '...' : 'MISSING');

const order = {
  id: "614752d9-6782-4945-a536-e27f6b118139",
  shippingName: "Ashraf Siddiqui",
  shippingLine1: "D 58/12, Sigra Crossing",
  shippingLine2: "Near Sigra Stadium",
  shippingCity: "Varanasi",
  shippingState: "Uttar Pradesh",
  shippingZip: "221001",
  shippingPhone: "9567812345",
  shippingCountry: "India",
  paymentMethod: "ONLINE",
  totalAmount: 995,
  createdAt: new Date().toISOString()
};

const cmuData = {
  shipments: [
    {
      name: order.shippingName.trim(),
      add: [order.shippingLine1.trim(), order.shippingLine2?.trim() ?? ''].filter(Boolean).join(', '),
      city: order.shippingCity.trim(),
      state: order.shippingState.trim(),
      pin: order.shippingZip.trim(),
      country: (order.shippingCountry ?? 'India').trim(),
      phone: order.shippingPhone.trim().replace(/\D/g, '').slice(-10), // ensure 10-digit
      order: order.id,
      payment_mode: 'Prepaid',
      return_pin: order.shippingZip.trim(),
      return_city: order.shippingCity.trim(),
      return_phone: order.shippingPhone.trim().replace(/\D/g, '').slice(-10),
      return_add: order.shippingLine1.trim(),
      return_name: 'Ranique Store',
      return_state: order.shippingState.trim(),
      return_country: 'India',
      products_desc: "Om Designer Oremium Rakhi, Evil eye rakhi",
      hsn_code: '',
      cod_amount: 0,
      order_date: order.createdAt,
      total_amount: Math.round(order.totalAmount),
      seller_add: 'Ranique Store, India',
      seller_name: 'Ranique',
      seller_inv: order.id.slice(-8).toUpperCase(),
      quantity: 4,
      waybill: '',
      shipment_width: 15,
      shipment_height: 10,
      weight: 0.5,
      seller_gst_tin: process.env.DELHIVERY_GST || '10AVTPV6245L1ZX',
      shipping_mode: 'Surface',
      pickup_location: pickupLocation,
    },
  ],
};

const formBody = new URLSearchParams();
formBody.set('format', 'json');
formBody.set('data', JSON.stringify(cmuData));

async function runTest() {
  if (!token) {
    console.error('ERROR: DELHIVERY_API_TOKEN is not configured in .env file!');
    return;
  }

  const url = `${baseUrl}/api/cmu/create.json`;
  console.log('\nSending POST request to:', url);
  console.log('Payload data:', JSON.stringify(cmuData, null, 2));

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: formBody.toString(),
    });

    console.log('\nResponse status:', res.status, res.statusText);
    const text = await res.text();
    console.log('Raw response body:');
    console.log(text);

    try {
      const json = JSON.parse(text);
      console.log('\nParsed JSON:');
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('\nCould not parse response as JSON.');
    }
  } catch (err) {
    console.error('Request failed:', err);
  }
}

runTest();
