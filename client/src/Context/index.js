import React, { useState, useEffect, createContext, useContext } from "react";
import axios from 'axios';
import calculateDailyWeatherSummary from "../helper/calculateDailyWeatherSummary";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    const [weatherData, setWeatherData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchWeatherData = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('http://localhost:5000/api');
            console.log(response.data);
            setWeatherData(response.data);
            setError(null);
        } catch (error) {
            setError(error.response ? error.response.data : 'Failed to fetch weather data.');
            console.error('Error fetching weather data:', error);
        } finally {
            setLoading(false); // End loading
        }
    };

    useEffect(() => {
        fetchWeatherData();

        const intervalId = setInterval(() => {
            fetchWeatherData();
        }, 300000);

        const summaryPostInterval = setInterval(async () => {
            if (weatherData.length > 0) {
                const dailySummary = calculateDailyWeatherSummary(weatherData);
                try {
                    await axios.post('http://localhost:5000/api/weather-summary', dailySummary);
                    console.log('Daily summary sent successfully');
                } catch (error) {
                    console.error('Error sending daily summary:', error);
                }
            }
        }, 3 * 60 * 60 * 1000);

        return () => {
            clearInterval(intervalId);
            clearInterval(summaryPostInterval);
        };
    }, [weatherData]); // Depend on weatherData to get the latest

    return (
        <WeatherContext.Provider value={{ weatherData, error, loading }}>
            {children}
        </WeatherContext.Provider>
    );
};

export const useWeatherContext = () => useContext(WeatherContext);
