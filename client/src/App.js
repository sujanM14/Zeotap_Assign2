import { WeatherProvider, useWeatherContext } from './Context';
import './App.css';
import BackgroundLayout from './Components/BackgroundLayout';
import WeatherCard from './Components/WeatherCard';

const WeatherDisplay = () => {
  const { weatherData, error } = useWeatherContext();

  if (weatherData.length > 0) {
      return (
          <div className='w-full h-screen text-white px-8'>
              <nav className='w-full p-3  items-center'>
                  <h1 className='font-bold tracking-wide text-black text-3xl'>Weather App</h1>
              </nav>
              <main className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8'>
                  {weatherData.map((data, index) => (
                      <WeatherCard
                          key={index}
                          temperature={data.main.temp}
                          windspeed={data.wind.speed}
                          humidity={data.main.humidity}
                          place={data.name}
                          heatIndex={data.main.feels_like}
                          description={data.weather[0].description}
                          date={data.dt}
                      />
                  ))}
              </main>
              {error && <div className="text-red-500 mt-4">Warning: {error}</div>}
          </div>
      );
  }

  // If there's no weather data and an error, display the error
  if (error) {
      return <div>Error: {error}</div>;
  }

  // Default to loading state
  return <div>Loading...</div>;
};


function App() {
  return (
    <div className="App">
      <WeatherProvider>
          <BackgroundLayout />
          <WeatherDisplay />
      </WeatherProvider>
      
      
      
    </div>
  );
}

export default App;
