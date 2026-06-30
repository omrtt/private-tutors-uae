require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tutors', require('./routes/tutors'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/tests', require('./routes/tests'));
app.use('/api/academic', require('./routes/academic'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/admin', require('./routes/admin'));

// Public settings endpoint (no auth required)
const Settings = require('./models/Settings');
app.get('/api/settings/public', async (req, res) => {
  try {
    const settings = await Settings.get();
    res.json({ platformFeePercent: settings.platformFeePercent || 15 });
  } catch (err) {
    res.json({ platformFeePercent: 15 });
  }
});

app.get('/api', (req, res) => res.json({ message: 'UAE Private Tutors API' }));

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

