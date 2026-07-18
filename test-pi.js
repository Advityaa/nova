const clientId = process.env.AIRWALLEX_CLIENT_ID;
const apiKey = process.env.AIRWALLEX_API_KEY;
const baseUrl = "https://api.airwallex.com";

async function run() {
  const authRes = await fetch(`${baseUrl}/api/v1/authentication/login`, {
    method: "POST",
    headers: {
      "x-client-id": clientId,
      "x-api-key": apiKey,
      "Content-Type": "application/json",
    },
  });
  const { token } = await authRes.json();
  
  const piRes = await fetch(`${baseUrl}/api/v1/pa/payment_intents/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      request_id: "test-req-123456",
      amount: 100.00,
      currency: "CNY",
      merchant_order_id: "test-ord-123456",
      return_url: "https://novaeventsgroup.com",
    }),
  });
  
  const piData = await piRes.text();
  console.log(piRes.status, piData);
}
run();
