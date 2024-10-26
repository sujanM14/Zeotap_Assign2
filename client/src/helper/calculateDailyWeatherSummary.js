

const calculateDailyWeatherSummary = (weatherData) => {
    const temperatures = weatherData.map(data => data.main.temp);
    const conditions = weatherData.map(data => data.weather[0].main); // Get main weather conditions

    const averageTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    const maxTemp = Math.max(...temperatures);
    const minTemp = Math.min(...temperatures);

    // Calculate the dominant weather condition (most frequent condition)
    const conditionFrequency = conditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});
    
    const dominantCondition = Object.keys(conditionFrequency).reduce((a, b) => 
        conditionFrequency[a] > conditionFrequency[b] ? a : b
    );

    // Return daily summary object
    return {
        date: new Date().toISOString().split('T')[0],  // Store today's date in YYYY-MM-DD format
        averageTemp,
        maxTemp,
        minTemp,
        dominantCondition,
    };
};

export default calculateDailyWeatherSummary;
