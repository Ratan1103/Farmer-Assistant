import { useEffect, useState } from "react"
import axios from "axios"
import  DashboardLayout  from "../components/DashboardLayout"
import { Card } from "../components/ui/card"

export default function WeatherPage() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("access")

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/weather/", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setWeather(res.data)
      } catch (err) {
        console.error("Failed to fetch weather:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchWeather()
  }, [token])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading weather...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!weather) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">No weather data available.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <h1 className="text-3xl font-bold">Weather Forecast</h1>
        <p className="text-muted-foreground">7-day weather forecast for {weather.location}</p>

        {/* Current Weather */}
        <Card className="p-6 flex justify-between items-center bg-muted/50">
          <div>
            <h2 className="text-2xl font-bold">{weather.current.temp}°C</h2>
            <p className="text-muted-foreground">{weather.current.condition}</p>
            <div className="mt-2 text-sm text-muted-foreground">
              Humidity: {weather.current.humidity}% | Rainfall: {weather.current.rainfall}mm
            </div>
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.current.icon}@2x.png`}
            alt={weather.current.condition}
            className="w-16 h-16"
          />
        </Card>

        {/* 7-Day Forecast */}
        <div>
          <h2 className="text-xl font-semibold mb-4">7-Day Forecast</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {weather.forecast.map((day, i) => (
              <Card key={i} className="p-4 text-center">
                <p className="font-medium">{new Date(day.date).toDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.condition}
                  className="mx-auto my-2 w-12 h-12"
                />
                <p className="text-lg font-bold">{day.temp}°C</p>
                <p className="text-sm text-muted-foreground">{day.condition}</p>
                <p className="text-xs text-muted-foreground">
                  Humidity: {day.humidity}% | Rain: {day.rainfall}mm
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* Farming Recommendations */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Farming Recommendations</h2>
          <div className="space-y-4">
            {weather.recommendations.map((rec, i) => (
              <Card key={i} className="p-4">
                <h3 className="font-bold">{rec.title}</h3>
                <p className="text-muted-foreground">{rec.advice}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
