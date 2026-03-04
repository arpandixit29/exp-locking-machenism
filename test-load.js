import http from 'http';

const BASE_URL = 'http://localhost:3000';
const ENDPOINT = '/api/book/1';
const DURATION = 20000; // 20 seconds
const ARRIVAL_RATE = 15; // requests per second
const INTERVAL = (1000 / ARRIVAL_RATE); // ms between requests

let stats = {
  200: 0,
  400: 0,
  423: 0,
  other: 0,
  total: 0,
  responseTimes: []
};

function makeRequest() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        stats.responseTimes.push(responseTime);
        
        if (res.statusCode === 200) stats[200]++;
        else if (res.statusCode === 400) stats[400]++;
        else if (res.statusCode === 423) stats[423]++;
        else stats.other++;
        
        stats.total++;
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('Request failed:', e.message);
      resolve();
    });

    req.end();
  });
}

async function runLoadTest() {
  console.log('🚀 Starting load test...');
  console.log(`📊 Target: ${BASE_URL}${ENDPOINT}`);
  console.log(`📈 Arrival Rate: ${ARRIVAL_RATE} requests/sec`);
  console.log(`⏱️  Duration: ${DURATION / 1000} seconds\n`);

  const startTime = Date.now();
  let requestCount = 0;

  while (Date.now() - startTime < DURATION) {
    const batchStart = Date.now();
    
    // Send ARRIVAL_RATE requests
    const promises = [];
    for (let i = 0; i < ARRIVAL_RATE; i++) {
      promises.push(makeRequest());
      requestCount++;
    }

    await Promise.all(promises);
    
    // Wait to maintain arrival rate
    const elapsed = Date.now() - batchStart;
    const waitTime = 1000 - elapsed;
    
    if (waitTime > 0) {
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  // Print results
  console.log('\n📋 Load Test Results:');
  console.log('═'.repeat(50));
  console.log(`Total Requests: ${stats.total}`);
  console.log(`✅ 200 OK: ${stats[200]} (successful bookings)`);
  console.log(`⚠️  400 Bad Request: ${stats[400]} (seat already booked)`);
  console.log(`🔒 423 Locked: ${stats[423]} (resource locked)`);
  console.log(`❌ Other: ${stats.other}`);
  console.log('═'.repeat(50));

  if (stats.responseTimes.length > 0) {
    stats.responseTimes.sort((a, b) => a - b);
    const min = stats.responseTimes[0];
    const max = stats.responseTimes[stats.responseTimes.length - 1];
    const mean = stats.responseTimes.reduce((a, b) => a + b) / stats.responseTimes.length;
    const median = stats.responseTimes[Math.floor(stats.responseTimes.length / 2)];
    const p95Index = Math.floor(stats.responseTimes.length * 0.95);
    const p99Index = Math.floor(stats.responseTimes.length * 0.99);

    console.log('\n⏱️  Response Times (ms):');
    console.log(`Min: ${min.toFixed(2)}`);
    console.log(`Max: ${max.toFixed(2)}`);
    console.log(`Mean: ${mean.toFixed(2)}`);
    console.log(`Median: ${median.toFixed(2)}`);
    console.log(`P95: ${stats.responseTimes[p95Index].toFixed(2)}`);
    console.log(`P99: ${stats.responseTimes[p99Index].toFixed(2)}`);
  }

  console.log('\n✅ Load test completed!');
  process.exit(0);
}

runLoadTest().catch(err => {
  console.error('Load test failed:', err);
  process.exit(1);
});
