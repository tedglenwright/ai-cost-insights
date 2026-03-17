const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(5003, '0.0.0.0', () => {
  console.log('AIOptimizer frontend running on http://0.0.0.0:5003');
});
