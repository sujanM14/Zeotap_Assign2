/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation
import { useDate } from '../Utils/useDate';
import sun from '../assets/icons/sun.png';
import cloud from '../assets/icons/cloud.png';
import fog from '../assets/icons/fog.png';
import rain from '../assets/icons/rain.png';
import snow from '../assets/icons/snow.png';
import storm from '../assets/icons/storm.png';
import wind from '../assets/icons/windy.png';
import '../index.css';

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  description,
  date,
}) => {
  const convertTemperature = (tempInKelvin) => {
    return (tempInKelvin - 273.15).toFixed(2);
  };

  const [icon, setIcon] = useState(sun);
  const { time } = useDate();

  useEffect(() => {
    if (description) {
      const lowerDescription = description.toLowerCase();
      if (lowerDescription.includes('cloud')) {
        setIcon(cloud);
      } else if (lowerDescription.includes('rain')) {
        setIcon(rain);
      } else if (lowerDescription.includes('clear')) {
        setIcon(sun);
      } else if (lowerDescription.includes('thunder')) {
        setIcon(storm);
      } else if (lowerDescription.includes('fog')) {
        setIcon(fog);
      } else if (lowerDescription.includes('snow')) {
        setIcon(snow);
      } else if (lowerDescription.includes('wind')) {
        setIcon(wind);
      } else {
        setIcon(sun); // Default icon if no conditions match
      }
    }
  }, [description]);

  return (
    <div className='w-[22rem] min-w-[22rem] h-[30rem] glassCard p-4'>
      <div className='flex w-full justify-center items-center gap-4 mt-12 mb-4'>
        <img src={icon} alt="weather_icon" />
        <p className='font-bold text-5xl flex justify-center items-center'>
          {convertTemperature(temperature)} &deg;C
        </p>
      </div>
      <div className='font-bold text-center text-xl'>
        {place}
      </div>
      <div className='font-bold text-center text-xs'>
        <p>Feels like: {convertTemperature(heatIndex)} &deg;C</p>
      </div>
      <div className='w-full flex justify-between items-center mt-4'>
        <p className='flex-1 text-center p-2'>{new Date().toDateString()}</p>
        <p className='flex-1 text-center p-2'>{time}</p>
      </div>
      <div className='w-full flex justify-between items-center mt-4 gap-4'>
        <div className='flex-1 text-center p-2 font-bold bg-blue-600 shadow rounded-lg'>
          Wind Speed <span className='font-normal'>{windspeed} km/h</span>
        </div>
        <div className='flex-1 text-center p-2 font-bold rounded-lg bg-green-600'>
          Humidity <span className='font-normal'>{humidity}%</span> {/* Adjusted to percentage */}
        </div>
      </div>
    </div>
  );
};

// Prop Types validation
WeatherCard.propTypes = {
  temperature: PropTypes.number.isRequired,
  windspeed: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  place: PropTypes.string.isRequired,
  heatIndex: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};

export default WeatherCard;
