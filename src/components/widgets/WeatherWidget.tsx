import { useState, useEffect } from 'react';
import { FiRefreshCw, FiMapPin, FiWind, FiDroplet } from 'react-icons/fi';
import { useDashboardStore } from '../../store/dashboardStore';
import { fetchWeather } from '../../services/weatherAPI';
import type { WeatherConfig, WeatherData } from '../../types';

interface WeatherWidgetProps {
  widgetId: string;
  config: WeatherConfig;
}

const WeatherWidget = ({ widgetId, config }: WeatherWidgetProps) => {
  const { updateWidgetConfig } = useDashboardStore();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [locationInput, setLocationInput] = useState(config.location);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);

    const data = await fetchWeather(config.location, config.units);

    if (data) {
      setWeather(data);
    } else {
      setError('Failed to load weather data');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
    // Refresh every 30 minutes
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [config.location, config.units]);

  const handleLocationSave = () => {
    if (locationInput.trim()) {
      updateWidgetConfig(widgetId, { location: locationInput.trim() });
      setIsEditing(false);
    }
  };

  const handleUnitsToggle = () => {
    const newUnits = config.units === 'metric' ? 'imperial' : 'metric';
    updateWidgetConfig(widgetId, { units: newUnits });
  };

  const unitSymbol = config.units === 'metric' ? '°C' : '°F';
  const windUnit = config.units === 'metric' ? 'km/h' : 'mph';

  if (loading && !weather) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <FiRefreshCw className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error || 'No weather data'}</p>
        <button onClick={loadWeather} className="btn-primary text-sm">
          <FiRefreshCw className="inline mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLocationSave()}
                className="input-field text-sm py-1"
                placeholder="Enter location"
                autoFocus
              />
              <button onClick={handleLocationSave} className="btn-primary text-sm py-1">
                Save
              </button>
            </div>
          ) : (
            <div
              className="flex items-center space-x-1 cursor-pointer group"
              onClick={() => setIsEditing(true)}
            >
              <FiMapPin className="w-4 h-4 text-slate-400 group-hover:text-primary-500" />
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-primary-500">
                {weather.location}
              </h3>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleUnitsToggle}
            className="text-xs text-slate-500 hover:text-primary-500"
            title="Toggle units"
          >
            {config.units === 'metric' ? '°C' : '°F'}
          </button>
          <button
            onClick={loadWeather}
            className="text-slate-400 hover:text-primary-500"
            disabled={loading}
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Current Weather */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-5xl font-bold text-slate-900 dark:text-white">
            {weather.temperature}
            {unitSymbol}
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{weather.condition}</p>
        </div>
        <div className="text-6xl">{weather.icon}</div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <FiDroplet className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500">Humidity</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {weather.humidity}%
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FiWind className="w-4 h-4 text-slate-400" />
          <div>
            <div className="text-xs text-slate-500">Wind</div>
            <div className="text-sm font-medium text-slate-900 dark:text-white">
              {weather.windSpeed} {windUnit}
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      {weather.forecast && weather.forecast.length > 0 && (
        <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="grid grid-cols-5 gap-2">
            {weather.forecast.slice(0, 5).map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-slate-500 mb-1">
                  {i === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                </div>
                <div className="text-2xl mb-1">{day.icon}</div>
                <div className="text-xs font-medium text-slate-900 dark:text-white">
                  {day.high}°
                </div>
                <div className="text-xs text-slate-500">{day.low}°</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
