// model/thresholdSchema.js
import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  email: { type: String, required: true },
  city: {type:String , required:true},
  temperature: { type: Number, required: true },
  condition: { type: String }, 
  consecutiveUpdates: { type: Number, default: 2 }, // Number of consecutive updates for the alert
});

const Alert = mongoose.model('Alerts', alertSchema);
export default Alert;
