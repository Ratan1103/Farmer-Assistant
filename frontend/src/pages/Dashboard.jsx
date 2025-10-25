import { useEffect, useState } from "react";
import { getWeather } from "../api/weatherApi";
import axios from "axios";
export default function Dashboard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

useEffect(() => {
  async function fetchWeather() {
    const token = localStorage.getItem("access");
    if (!token) {
      setError("No access token found");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/weather/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Weather API response:", res.data);
      setWeather(res.data);
    } catch (err) {
      console.error("Weather fetch failed:", err.response || err.message);
      setError("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  }

  fetchWeather();
}, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">🌾 Farmer Dashboard</h1>

      {/* Weather Section */}
      <div className="bg-blue-100 p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">☀ Weather Forecast</h2>

        {loading && <p>Loading weather...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {weather && weather.forecast && weather.forecast.length > 0 ? (
        <>
            <p><b>Location:</b> {weather.location}</p>
            {weather.forecast.map((day, i) => (
            <div key={i}>
                📅 {day.date} → 🌡 {day.temp}°C, {day.weather}, 💧 {day.humidity}%
            </div>
            ))}
        </>
        ) : (
        <p>No forecast data available</p>
        )}

      </div>

      {/* Placeholders for other Phase 2 features */}
      <div className="bg-green-100 p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold">💹 Market Prices</h2>
        <p>Coming soon...</p>
      </div>

      <div className="bg-yellow-100 p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold">📈 Price Trends</h2>
        <p>Coming soon...</p>
      </div>

      <div className="bg-red-100 p-4 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold">⚠ Alerts</h2>
        <p>Coming soon...</p>
      </div>
    </div>
  );
}
