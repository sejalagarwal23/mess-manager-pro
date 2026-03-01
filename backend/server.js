const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Vite dev server
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/bills', require('./routes/bills'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/mess-config', require('./routes/messConfig'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
