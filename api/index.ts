import 'reflect-metadata';
console.log('API Entry Point: Loading Express app...');
import app from '../backend/src/app';
console.log('Express app loaded successfully.');

// This is a direct test to see if the function is reached
app.get('/api/vercel-health', (req, res) => {
  console.log('Vercel Health Check Hit');
  res.json({
    status: 'Vercel API is functioning',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

app.get('/api/test-direct', (req, res) => {
  res.json({ message: 'Direct root function reachable' });
});

export default app;
