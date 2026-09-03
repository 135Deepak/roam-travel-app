import { useEffect, useState } from "react";
import { getCurrentWeather } from "../services/weatherApi";

function WeatherCard({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        setError(false);

        const data = await getCurrentWeather(
          destination.coordinates.lat,
          destination.coordinates.lon
        );

        setWeather(data);
      } catch (err) {
        console.error(
          `Weather error for ${destination.name}:`,
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadWeather();
  }, [
    destination.coordinates.lat,
    destination.coordinates.lon,
    destination.name,
  ]);

  if (loading) {
    return (
      <article className="weather-card">
        <h3>{destination.name}</h3>
        <p>Loading weather...</p>
      </article>
    );
  }

  if (error || !weather) {
    return (
      <article className="weather-card">
        <h3>{destination.name}</h3>
        <p>Weather unavailable</p>
      </article>
    );
  }

  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const condition =
    weather.weather?.[0]?.description || "Unknown";

  return (
    <article className="weather-card">
      <div className="weather-card-top">
        <div>
          <span className="weather-location">
            {destination.name}
          </span>

          <h3>{temperature}°C</h3>
        </div>

        <div className="weather-icon">
          {getWeatherIcon(weather.weather?.[0]?.main)}
        </div>
      </div>

      <p className="weather-condition">
        {condition}
      </p>

      <div className="weather-details">
        <span>
          Feels like {feelsLike}°C
        </span>

        <span>
          💧 {weather.main.humidity}%
        </span>

        <span>
          💨 {weather.wind.speed} m/s
        </span>
      </div>
    </article>
  );
}

function getWeatherIcon(condition) {
  switch (condition) {
    case "Clear":
      return "☀️";

    case "Clouds":
      return "☁️";

    case "Rain":
      return "🌧️";

    case "Drizzle":
      return "🌦️";

    case "Thunderstorm":
      return "⛈️";

    case "Snow":
      return "❄️";

    case "Mist":
    case "Fog":
    case "Haze":
      return "🌫️";

    default:
      return "🌤️";
  }
}

export default WeatherCard;