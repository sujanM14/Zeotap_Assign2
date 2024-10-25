// models/Threshold.js
import mongoose from 'mongoose';

const thresholdSchema = new mongoose.Schema({
  city: { type: String, required: true },
  maxTemp: { type: Number, required: true }, // Max temperature threshold
  minTemp: { type: Number }, // Optional: Min temperature threshold
  weatherCondition: { type: String }, // Example: "heavy rain", "snow"
});

const Threshold = mongoose.model('Threshold', thresholdSchema);

export default Threshold;
