import app from '../backend/src/app';

// This is a direct test to see if the function is reached
app.get('/api/test-direct', (req, res) => {
  res.json({ message: 'Direct root function reachable' });
});

export default app;
