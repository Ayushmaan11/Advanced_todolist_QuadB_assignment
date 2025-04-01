import axios from 'axios';


const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;


if (!API_KEY && process.env.NODE_ENV === 'development') {
  console.warn('Using mock weather data - set REACT_APP_WEATHER_API_KEY in .env.local');
}

export const fetchWeather = async (city) => {
  try {
    if (!city) throw new Error('City parameter is required');
    
    
    if (!API_KEY && process.env.NODE_ENV === 'development') {
      return { 
        data: {
          name: city,
          main: { temp: 22 + Math.floor(Math.random() * 10) },
          weather: [{ description: 'sunny', icon: '01d' }]
        }
      };
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        },
        timeout: 5000
      }
    );
    
    return response;
    
  } catch (error) {
    let errorMessage = 'Failed to fetch weather';
    
    if (error.response) {
      errorMessage = `Weather API error: ${error.response.status} - ${
        error.response.data?.message || 'No additional info'
      }`;
    } else if (error.request) {
      errorMessage = 'No response from weather service';
    }
    
    console.error('Weather fetch error:', errorMessage);
    throw new Error(errorMessage);
  }
};