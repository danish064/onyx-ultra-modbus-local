import express from 'express';
import apiRoutes from '../backend/routes/index.js';
import http from 'http';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

const server = app.listen(3002, async () => {
  console.log('Test Server started on port 3002');
  
  const getMetrics = () => {
    return new Promise((resolve, reject) => {
      http.get('http://localhost:3002/api/metrics', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          resolve({ status: res.statusCode, body: data });
        });
      }).on('error', reject);
    });
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    console.log('\n--- FIRST POLL ---');
    const res1 = await getMetrics();
    console.log('Poll 1 Response Status:', res1.status);
    console.log('Poll 1 Response Body preview:', res1.body.substring(0, 100));

    console.log('\nSleeping 5 seconds...');
    await sleep(5000);

    console.log('\n--- SECOND POLL ---');
    const res2 = await getMetrics();
    console.log('Poll 2 Response Status:', res2.status);
    console.log('Poll 2 Response Body:', res2.body);

    console.log('\nSleeping 5 seconds...');
    await sleep(5000);

    console.log('\n--- THIRD POLL ---');
    const res3 = await getMetrics();
    console.log('Poll 3 Response Status:', res3.status);
    console.log('Poll 3 Response Body:', res3.body);

  } catch (err) {
    console.error('Test run failed:', err);
  } finally {
    console.log('\nShutting down test server...');
    server.close();
  }
});
