import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { staticPrices, priceTrendData } from "../data/marketData";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MarketPrices() {
  const [selectedCrop, setSelectedCrop] = useState("wheat");

  // Get highest & best opportunity crop
  const highestPrice = staticPrices.reduce(
    (max, crop) =>
      parseInt(crop.price.replace(/[^\d]/g, "")) >
      parseInt(max.price.replace(/[^\d]/g, ""))
        ? crop
        : max,
    staticPrices[0]
  );

  const bestOpportunity = staticPrices[0]; // mock logic (you can calculate % increase)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Market Prices</h1>
          <p className="text-muted-foreground">
            Current crop prices in your region
          </p>
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <p className="text-gray-500">Average Price Change</p>
            <p className="text-2xl font-bold text-green-600">+2.1%</p>
            <p className="text-sm text-gray-400">Last 7 days</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <p className="text-gray-500">Highest Price</p>
            <p className="text-2xl font-bold">{highestPrice.crop}</p>
            <p className="text-sm text-gray-400">{highestPrice.price}</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow text-center">
            <p className="text-gray-500">Best Opportunity</p>
            <p className="text-2xl font-bold text-green-700">
              {bestOpportunity.crop}
            </p>
            <p className="text-sm text-gray-400">+4.3% increase</p>
          </div>
        </div>

        {/* Crop Prices Table */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Crop Prices Today</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3">Crop</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">Previous Price</th>
                  <th className="p-3">Change</th>
                  <th className="p-3">Trend</th>
                </tr>
              </thead>
              <tbody>
                {staticPrices.map((crop, i) => {
                  const current = parseInt(crop.price.replace(/[^\d]/g, ""));
                  const prev = current - Math.floor(Math.random() * 200); // fake previous price
                  const diff = current - prev;
                  const change = ((diff / prev) * 100).toFixed(1);

                  return (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 font-medium">{crop.crop}</td>
                      <td className="p-3 font-bold">{crop.price}</td>
                      <td className="p-3 text-gray-500">₹{prev}</td>
                      <td
                        className={`p-3 font-semibold ${
                          diff >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {diff >= 0 ? "+" : ""}
                        {change}%
                      </td>
                      <td className="p-3">
                        {diff > 0 ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            ↑ Up
                          </span>
                        ) : diff < 0 ? (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            ↓ Down
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            → Stable
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Price Trend Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Price Trend</h2>
          <div className="flex gap-4 mb-4">
            {Object.keys(priceTrendData).map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCrop === crop
                    ? "bg-green-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={priceTrendData[selectedCrop]}>
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#16a34a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Insights */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Market Insights</h2>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="font-semibold text-green-800">
              🌾 Good Selling Opportunity
            </p>
            <p className="text-gray-600">
              Wheat prices are at a 3-month high. Consider selling if you have
              surplus stock.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="font-semibold text-blue-800">📊 Market Trend</p>
            <p className="text-gray-600">
              Overall market is bullish. Most crops showing positive growth in
              the last week.
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="font-semibold text-red-800">⚠️ Price Alert</p>
            <p className="text-gray-600">
              Cotton prices declining. Monitor the market before making selling
              decisions.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
