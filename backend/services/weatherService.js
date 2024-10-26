// services/weatherService.js
import axios from 'axios';
import fetchWeatherDataAndCheckThresholds from './fetchWeatherDataAndCheckThresholds.js';
const cities = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];

let weatherData = [];
let error = null;

export const fetchWeatherData = async () => {
    const API_KEY = process.env.WEATHER_API_KEY ; // Ensure your .env file contains this
    try {
        const responses = await Promise.allSettled(
            cities.map(city =>
                axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
            )
        );

        const successfulResponses = responses.filter(response => response.status === 'fulfilled');
        const failedResponses = responses.filter(response => response.status === 'rejected');

        weatherData = successfulResponses.map(response => response.value.data); // Store the fetched weather data
        
        await fetchWeatherDataAndCheckThresholds(weatherData);
        // Only set error if all requests failed
        if (successfulResponses.length === 0) {
            error = 'Failed to fetch weather data.';
        } else if (failedResponses.length > 0) {
            console.warn('Some requests failed:', failedResponses);
        } else {
            error = null; // Clear any previous error if all requests succeed
        }

        // console.log(weatherData); // Log fetched data

        return weatherData; // Return the fetched weather data
    } catch (err) {
        console.error('Error fetching weather data:', err);
        error = 'Error fetching weather data.';
        throw new Error(error); // Throw error for route to handle
    }
};

// Function to periodically update the weather data (optional)
export const updateWeatherData = async () => {
    await fetchWeatherData(); // Call the fetching function
    // Optionally, implement logic for sending alerts or checking thresholds
};

// Fetch weather data immediately when the server starts
updateWeatherData();

// Set an interval to fetch the data every 5 minutes
setInterval(updateWeatherData, 300000); // 300000 milliseconds = 5 minutes
