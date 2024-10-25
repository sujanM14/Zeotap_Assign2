import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WeatherSummary from './model/weatherSummarySchema.js';
import Customer from './model/Customer.js';
import cron from 'node-cron';
import fetchWeatherDataAndCheckThresholds from './services/fetchWeatherDataAndCheckThresholds.js';
import Threshold from './model/thresholdSchema.js';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI from .env
const mongo_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/Weather-app"; // Default to local if not specified
mongoose.set('debug', true);

// Connect to MongoDB
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Set up the express app
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Define the port
const PORT = process.env.PORT || 5000;

// API Route to save daily weather summary
app.post('/api/weather-summary', async (req, res) => {
  try {
    const savedSummary = await WeatherSummary.create(req.body);
    res.status(201).json({ message: 'Weather summary saved successfully!', data: savedSummary });
  } catch (error) {
    console.error('Error saving weather summary:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/email', async (req, res) => {
  const { email, city } = req.body; // Assume city is also sent by the user

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Save to Customer model (assuming Customer is your email alert model)
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json({ message: 'Email registered for alerts successfully!', data: newCustomer });
  } catch (error) {
    console.error('Error saving email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/set-threshold', async (req, res) => {
  const { email, city, maxTemp, weatherCondition } = req.body;

  try {
    const newThreshold = await Threshold.create({
      city,
      maxTemp,
      weatherCondition,
    });
    res.status(201).json({ message: 'Threshold set successfully', data: newThreshold });
  } catch (error) {
    console.error('Error setting threshold:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Schedule the weather data fetching job
cron.schedule('*/2 * * * *', () => {
  fetchWeatherDataAndCheckThresholds();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
