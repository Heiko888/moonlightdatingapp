const axios = require('axios');

async function testMetrics() {
  try {
    console.log('🔍 Testing HD App Metrics...');
    
    // Test HD App Health
    const healthResponse = await axios.get('http://localhost:4001/health');
    console.log('✅ Health Check:', healthResponse.data);
    
    // Test Metrics Endpoint
    const metricsResponse = await axios.get('http://localhost:4001/metrics/prometheus');
    console.log('✅ Metrics Response Length:', metricsResponse.data.length);
    
    // Check for specific metrics
    const metrics = metricsResponse.data;
    const hasProcessMetrics = metrics.includes('process_cpu_seconds_total');
    const hasHttpMetrics = metrics.includes('http_requests_total');
    
    console.log('📊 Available Metrics:');
    console.log('- Process Metrics:', hasProcessMetrics ? '✅' : '❌');
    console.log('- HTTP Metrics:', hasHttpMetrics ? '✅' : '❌');
    
    // Test Prometheus
    console.log('\n🔍 Testing Prometheus...');
    const prometheusResponse = await axios.get('http://localhost:9090/api/v1/query?query=up');
    console.log('✅ Prometheus Status:', prometheusResponse.data.status);
    
    // Test specific queries
    const cpuQuery = await axios.get('http://localhost:9090/api/v1/query?query=process_cpu_seconds_total');
    console.log('✅ CPU Metrics Available:', cpuQuery.data.data.result.length > 0);
    
    const httpQuery = await axios.get('http://localhost:9090/api/v1/query?query=http_requests_total');
    console.log('✅ HTTP Metrics Available:', httpQuery.data.data.result.length > 0);
    
    // Generate some test data
    console.log('\n📈 Generating test data...');
    for (let i = 0; i < 5; i++) {
      await axios.get('http://localhost:4001/health');
      await axios.get('http://localhost:4001/');
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    console.log('✅ Test data generated');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}

testMetrics();
