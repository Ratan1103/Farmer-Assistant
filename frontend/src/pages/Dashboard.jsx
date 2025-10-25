import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err.response || err.message);
        setError("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  return (
    <DashboardLayout
      userName={profile?.full_name || "Farmer"}
      onLogout={() => {
        localStorage.clear();
        window.location.href = "/login";
      }}
    >
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {profile?.full_name || "Farmer"}!
          </h1>
          <p className="text-gray-600">
            Here’s what’s happening on your farm today
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-gray-500">Farm Size</p>
            <p className="text-xl font-bold">
              {profile?.land_size || "--"} acres 🌾
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-gray-500">Location</p>
            <p className="text-xl font-bold">
              {profile?.district || "Unknown"} 📍
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-gray-500">Active Crop</p>
            <p className="text-xl font-bold">
              {profile?.crop || "No crop selected"} 🌱
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-gray-500">Health Status</p>
            <p className="text-xl font-bold text-green-600">Good ✅</p>
            <p className="text-sm text-gray-500">All crops healthy</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span>🌤️</span>
              <div>
                <p className="font-semibold">Weather Alert</p>
                <p className="text-gray-600">
                  Heavy rainfall expected tomorrow in your region
                </p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex items-start gap-3">
              <span>💰</span>
              <div>
                <p className="font-semibold">Market Update</p>
                <p className="text-gray-600">
                  Wheat prices increased by 5% in your region
                </p>
                <p className="text-sm text-gray-400">4 hours ago</p>
              </div>
            </div>
            <hr className="my-4" />
            <div className="flex items-start gap-3">
              <span>📋</span>
              <div>
                <p className="font-semibold">New Scheme Available</p>
                <p className="text-gray-600">
                  PM Kisan Samman Nidhi scheme updated for your state
                </p>
                <p className="text-sm text-gray-400">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <p className="font-semibold">Check Weather</p>
              <p className="text-gray-600 text-sm">View 7-day forecast</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <p className="font-semibold">Market Prices</p>
              <p className="text-gray-600 text-sm">Check current rates</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <p className="font-semibold">Disease Check</p>
              <p className="text-gray-600 text-sm">Scan crop images</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
