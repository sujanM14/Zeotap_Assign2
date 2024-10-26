# Real-Time Data Processing System for Weather Monitoring

## Objective
The objective of this project is to develop a real-time data processing system that monitors weather conditions and provides summarized insights using rollups and aggregates. The system utilizes data from the [OpenWeatherMap API](https://openweathermap.org/) to fetch current weather data for various cities.

## Table of Contents
- [Dependencies](#dependencies)
- [Data Retrieval](#data-retrieval)
- [Data Processing and Aggregation](#data-processing-and-aggregation)
- [Alerts System](#alerts-system)
- [Frontend](#frontend)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Dependencies
The application relies on several packages:
- **express**: Web server framework.
- **mongoose**: MongoDB object modeling.
- **dotenv**: Environment variable management.
- **node-cron**: Task scheduling.
- **cors**: Enables Cross-Origin Resource Sharing.

### Database
- **MongoDB**: Used to store weather summaries, customer emails, and thresholds.

## Data Retrieval
The system retrieves real-time weather data for selected cities—Delhi, Mumbai, Chennai, Bangalore, Kolkata, and Hyderabad—every 5 minutes through the OpenWeatherMap API. This data includes temperature, weather conditions, and timestamps, which are stored in a MongoDB collection for further analysis and historical tracking.
- **Key Decision**: A 5-minute interval was chosen to provide timely updates while minimizing strain on both the API and MongoDB.
- **Technology**: Axios is used for making API requests, and `cron.schedule` is implemented to establish a continuous fetching mechanism, ensuring that data is retrieved asynchronously without hindering other operations.

## Data Processing and Aggregation
The system compiles weather data for each city over the last 24 hours to calculate essential metrics, which include:
- Average temperature
- Highest temperature
- Lowest temperature
- Predominant weather condition

## Alerts System
The function `fetchWeatherDataAndCheckThresholds` retrieves weather data for six cities using the OpenWeatherMap API, with the API key sourced from environment variables or a hardcoded default. It processes the responses to filter out successful ones and logs them. For each city, the function:
- Converts the temperature from Kelvin to Celsius.
- Checks against defined temperature thresholds stored in the database.
- Sends alerts to customers in that city via email if:
  - The current temperature exceeds the maximum threshold.
  - The current temperature falls below the minimum threshold.
  - The weather description matches specific conditions.

The alerts include details such as the city name, current temperature, and weather condition.

## Frontend
The frontend is built using **React.js** along with **Tailwind CSS** to provide a user-friendly interface that displays real-time weather conditions for each city. Each city features a card-like design showcasing:
- Current temperature
- Feels-like temperature
- Weather conditions
- Appropriate weather icons

## Installation
To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/sujanM14/Zeotap_Assign2.git
   cd Zeotap_Assign2
2. Install backend dependencies:
    ```bash
    cd backend
    npm install

3. Set up the environment variables:

Create a .env file in the backend directory.
Add your OpenWeatherMap API key and MongoDB connection string to the .env file.

4. Install frontend dependencies:
 ```bash
 cd ../frontend
 npm install

5. Start the backend server:
 ```bash
 cd backend
 npm start

6. Start the frontend application:
 ```bash
 cd ../frontend
 npm start
Access the application in your browser at http://localhost:3000.
