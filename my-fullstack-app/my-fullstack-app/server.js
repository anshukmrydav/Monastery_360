// my-fullstack-app/server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the parent 'new' folder
app.use(express.static(path.join(__dirname, '..')));


// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Optional API route
app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Backend API!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
