const clientId = process.env.AIRWALLEX_CLIENT_ID;
const apiKey = process.env.AIRWALLEX_API_KEY;
fetch("https://api.airwallex.com/api/v1/authentication/login", {
  method: "POST",
  headers: {
    "x-client-id": clientId,
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  },
}).then(res => res.text()).then(console.log);
