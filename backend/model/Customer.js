// model/alertSchema.js
import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  city: { type: String, required: true },
});

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer;
