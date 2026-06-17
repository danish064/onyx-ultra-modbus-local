import http from 'http';

function getMetrics() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3001/api/metrics', (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  console.log('Sending 5 consecutive polls spaced 500ms apart...');
  
  for (let i = 1; i <= 5; i++) {
    const start = Date.now();
    try {
      console.log(`\nPoll ${i} started...`);
      const res = await getMetrics();
      const elapsed = Date.now() - start;
      console.log(`Poll ${i} Success! Cached: ${res.cached ? 'YES' : 'NO'}, Duration: ${elapsed}ms`);
    } catch (err) {
      const elapsed = Date.now() - start;
      console.error(`Poll ${i} Failed after ${elapsed}ms:`, err.message);
    }
    
    if (i < 5) {
      await sleep(500);
    }
  }
}

run();
