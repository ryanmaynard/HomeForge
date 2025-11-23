/**
 * Weather API Service using Open-Meteo
 * https://open-meteo.com/ - Free weather API, no API key required
 */

import type { WeatherData, ForecastDay } from '../types';

// Geocoding API to convert city name to coordinates
const geocodeLocation = async (location: string): Promise<{ lat: number; lon: number } | null> => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );

    if (!response.ok) throw new Error('Geocoding failed');

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      lat: result.latitude,
      lon: result.longitude,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Weather condition code to description mapping
const getWeatherCondition = (code: number): { description: string; icon: string } => {
  const conditions: Record<number, { description: string; icon: string }> = {
    0: { description: 'Clear sky', icon: '☀️' },
    1: { description: 'Mainly clear', icon: '🌤️' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Foggy', icon: '🌫️' },
    48: { description: 'Foggy', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Drizzle', icon: '🌦️' },
    55: { description: 'Heavy drizzle', icon: '🌧️' },
    61: { description: 'Light rain', icon: '🌧️' },
    63: { description: 'Rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '⛈️' },
    71: { description: 'Light snow', icon: '🌨️' },
    73: { description: 'Snow', icon: '❄️' },
    75: { description: 'Heavy snow', icon: '❄️' },
    77: { description: 'Snow grains', icon: '❄️' },
    80: { description: 'Light showers', icon: '🌦️' },
    81: { description: 'Showers', icon: '🌧️' },
    82: { description: 'Heavy showers', icon: '⛈️' },
    85: { description: 'Light snow showers', icon: '🌨️' },
    86: { description: 'Snow showers', icon: '🌨️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with hail', icon: '⛈️' },
  };

  return conditions[code] || { description: 'Unknown', icon: '❓' };
};

export const fetchWeather = async (
  location: string,
  units: 'metric' | 'imperial' = 'metric'
): Promise<WeatherData | null> => {
  try {
    // Step 1: Geocode the location
    const coords = await geocodeLocation(location);
    if (!coords) {
      throw new Error('Location not found');
    }

    // Step 2: Fetch weather data
    const tempUnit = units === 'metric' ? 'celsius' : 'fahrenheit';
    const windSpeedUnit = units === 'metric' ? 'kmh' : 'mph';

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${coords.lat}&longitude=${coords.lon}` +
        `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
        `&temperature_unit=${tempUnit}` +
        `&wind_speed_unit=${windSpeedUnit}` +
        `&timezone=auto` +
        `&forecast_days=5`
    );

    if (!response.ok) throw new Error('Weather API request failed');

    const data = await response.json();

    // Parse current weather
    const current = data.current;
    const condition = getWeatherCondition(current.weather_code);

    // Parse forecast
    const forecast: ForecastDay[] = data.daily.time.slice(0, 5).map((date: string, i: number) => {
      const dayCondition = getWeatherCondition(data.daily.weather_code[i]);
      return {
        date,
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        condition: dayCondition.description,
        icon: dayCondition.icon,
      };
    });

    return {
      location,
      temperature: Math.round(current.temperature_2m),
      condition: condition.description,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      forecast,
      icon: condition.icon,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
};
