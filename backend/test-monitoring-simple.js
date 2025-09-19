// test-monitoring.js – ONE SHOT
import axios from 'axios';

const res = await axios.get('http://localhost:4001/readings', { timeout: 5000 });
console.log(res.status, res.data);

// sauber beenden
process.exit(0);
