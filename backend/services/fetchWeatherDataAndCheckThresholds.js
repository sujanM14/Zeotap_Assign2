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
    user: process.env.EMAIL_USER, // Email from .env
    pass: process.env.EMAIL_PASS,  // Password from .env
  }
});

const fetchWeatherDataAndCheckThresholds = async () => {
  try {
    const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY ;
    const responses = await Promise.allSettled(
      cities.map(city => axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`))
    );

    const successfulResponses = responses.filter(response => response.status === 'fulfilled').map(res => res.value.data);

    console.log(successfulResponses);

    // Now compare weather data with thresholds
    for (const weatherData of successfulResponses) {
      const { main: { temp }, name: city, weather } = weatherData; // Get temperature and city name

      // Convert temp from Kelvin to Celsius
      const tempCelsius = temp - 273.15;

      // Check thresholds from the database
      const thresholds = await Threshold.find({ city });

      // Loop through each threshold and check if any are breached
      for (const threshold of thresholds) {
        if (tempCelsius > threshold.maxTemp || tempCelsius < threshold.minTemp || weather[0].description.includes(threshold.weatherCondition)) {
          // If a threshold is breached, find all customers in the city
          const customers = await Customer.find({ city });

          console.log(threshold);
          // Send alert to each customer
          for (const customer of customers) {
            await sendWeatherAlert(customer.email, city, tempCelsius, weather[0].description);
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
