// test-monitoring.js – ONE SHOT (CommonJS Version)
const axios = require('axios');

async function testMonitoring() {
  try {
    const res = await axios.get('http://localhost:4001/metrics', { timeout: 5000 });
    console.log('Status:', res.status);
    console.log('Metrics:', res.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
  
  // sauber beenden
  process.exit(0);
}

testMonitoring();
