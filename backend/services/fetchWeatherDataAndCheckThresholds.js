// services/weatherService.js
import axios from 'axios';
import Threshold from '../model/thresholdSchema.js'; // Import the threshold model
import nodemailer from 'nodemailer'; // For sending email alerts
import Customer from '../model/Customer.js';

// Set up the transporter for nodemailer
const transporter = nodemailer.createTransport({
  secure:true,
  host: 'smtp.gmail.com',
  port:465,
  auth: {
    user: process.env.EMAIL_USER , // Email from .env
    pass: process.env.EMAIL_PASS ,  // Password from .env
  }
});

const fetchWeatherDataAndCheckThresholds = async (successfulResponses) => {
  try {
    for (const weatherData of successfulResponses) {
      const { main: { temp }, name: city, weather } = weatherData; // Get temperature and city name

      const tempCelsius = temp - 273.15; // Convert temp from Kelvin to Celsius
      const thresholds = await Threshold.find({ city });

      for (const threshold of thresholds) {
        if (tempCelsius > threshold.maxTemp || tempCelsius < threshold.minTemp || weather[0].description.includes(threshold.weatherCondition)) {
          // Find all customers in the city
          const customers = await Customer.find({ city });

          for (const customer of customers) {
            // Check how many alerts were sent today
            const today = new Date();
            const alertsToday = customer.alertTimestamps.filter(timestamp => {
              const alertDate = new Date(timestamp);
              return alertDate.getDate() === today.getDate() && alertDate.getMonth() === today.getMonth() && alertDate.getFullYear() === today.getFullYear();
            });

            // Send alert only if fewer than 2 emails have been sent today
            if (alertsToday.length < 2) {
              await sendWeatherAlert(customer.email, city, tempCelsius, weather[0].description);
              // Update the customer's alert timestamps
              customer.alertTimestamps.push(new Date());
              await customer.save();
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching or comparing weather data:', error);
    throw error;
  }
};

const sendWeatherAlert = async (email, city, tempCelsius, condition) => {
  try {
    const mailOptions = {
      from: "yasminmujawar425@gmail.com",
      to: email,
      subject: `Weather Alert for ${city}`,
      text: `Alert! The temperature in ${city} is ${tempCelsius.toFixed(2)}°C with the condition: ${condition}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Alert email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export default fetchWeatherDataAndCheckThresholds;
