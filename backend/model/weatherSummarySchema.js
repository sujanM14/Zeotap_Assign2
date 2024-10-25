import mongoose from 'mongoose';

const weatherSummarySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  averageTemp: {
    type: Number,
    required: true,
  },
  maxTemp: {
    type: Number,
    required: true,
  },
  minTemp: {
    type: Number,
    required: true,
  },
  dominantCondition: {
    type: String,
    required: true,
  },
});

const WeatherSummary = mongoose.model('WeatherSummary', weatherSummarySchema);

export default WeatherSummary;
