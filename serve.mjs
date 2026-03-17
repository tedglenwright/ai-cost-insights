import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.static(join(__dirname, 'dist')));

// SPA fallback
app.use((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(readFileSync(join(__dirname, 'dist', 'index.html'), 'utf-8'));
});

app.listen(5003, '0.0.0.0', () => {
  console.log('AIOptimizer frontend running on http://0.0.0.0:5003');
});
