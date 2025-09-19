const axios = require('axios');

async function testMonitoring() {
  console.log('🔍 HD App Monitoring Test Suite');
  console.log('================================\n');

  try {
    // 1. HD App Health Check
    console.log('1️⃣ Testing HD App Health...');
    const healthResponse = await axios.get('http://localhost:4001/health');
    console.log('✅ Health Check:', healthResponse.data);
    
    // 2. Metrics Endpoint
    console.log('\n2️⃣ Testing Metrics Endpoint...');
    const metricsResponse = await axios.get('http://localhost:4001/metrics/prometheus');
    console.log('✅ Metrics Response Length:', metricsResponse.data.length);
    
    // Check for specific metrics
    const metrics = metricsResponse.data;
    const hasProcessMetrics = metrics.includes('process_cpu_seconds_total');
    const hasHttpMetrics = metrics.includes('http_requests_total');
    const hasBusinessMetrics = metrics.includes('hd_type_distribution');
    
    console.log('📊 Available Metrics:');
    console.log('- Process Metrics:', hasProcessMetrics ? '✅' : '❌');
    console.log('- HTTP Metrics:', hasHttpMetrics ? '✅' : '❌');
    console.log('- Business Metrics:', hasBusinessMetrics ? '✅' : '❌');
    
    // 3. Prometheus Status
    console.log('\n3️⃣ Testing Prometheus...');
    const prometheusResponse = await axios.get('http://localhost:9090/api/v1/query?query=up');
    console.log('✅ Prometheus Status:', prometheusResponse.data.status);
    
    // 4. Alertmanager Status
    console.log('\n4️⃣ Testing Alertmanager...');
    const alertmanagerResponse = await axios.get('http://localhost:9093/api/v1/status');
    console.log('✅ Alertmanager Status:', alertmanagerResponse.data.status);
    
    // 5. Generate Test Data
    console.log('\n5️⃣ Generating Test Data...');
    for (let i = 0; i < 10; i++) {
      await axios.get('http://localhost:4001/health');
      await axios.get('http://localhost:4001/');
      await axios.get('http://localhost:4001/metrics/json');
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log('✅ Test data generated');
    
    // 6. Test Business Metrics
    console.log('\n6️⃣ Testing Business Metrics...');
    const businessMetricsResponse = await axios.get('http://localhost:4001/metrics/json');
    console.log('✅ Business Metrics:', businessMetricsResponse.data.status);
    
    // 7. Test Specific Queries
    console.log('\n7️⃣ Testing Specific Queries...');
    const queries = [
      'process_cpu_seconds_total',
      'process_resident_memory_bytes',
      'hd_type_distribution',
      'profile_distribution'
    ];
    
    for (const query of queries) {
      try {
        const response = await axios.get(`http://localhost:9090/api/v1/query?query=${query}`);
        const hasData = response.data.data.result.length > 0;
        console.log(`- ${query}:`, hasData ? '✅' : '❌');
      } catch (error) {
        console.log(`- ${query}: ❌ (Error: ${error.message})`);
      }
    }
    
    // 8. Test Alerts
    console.log('\n8️⃣ Testing Alerts...');
    const alertsResponse = await axios.get('http://localhost:9090/api/v1/alerts');
    console.log('✅ Active Alerts:', alertsResponse.data.data.alerts.length);
    
    console.log('\n🎉 Monitoring Test Suite completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test Suite failed:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

// Run the test suite
testMonitoring();
