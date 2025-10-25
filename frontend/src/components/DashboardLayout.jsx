import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function DashboardLayout({ children, userName, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/profile", label: "Profile", icon: "👤" },
    { href: "/dashboard/weather", label: "Weather", icon: "🌤️" },
    { href: "/dashboard/market", label: "Market Prices", icon: "💰" },
    { href: "/dashboard/schemes", label: "Govt Schemes", icon: "📋" },
    { href: "/dashboard/disease", label: "Disease Detection", icon: "🔬" },
    { href: "/dashboard/assistant", label: "AI Assistant", icon: "🤖" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-green-700 text-white border-b border-green-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-green-600 rounded-lg transition-colors"
            >
              <span className="text-xl">☰</span>
            </button>
            {/* ✅ Your original branding */}
            <span className="font-bold text-xl sm:inline">🌾 Farmer Assistant</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <span className="text-sm hidden sm:inline">Welcome, {userName}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 border border-white/50 rounded-lg hover:bg-green-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href}>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                        isActive
                          ? "bg-green-700 text-white"
                          : "text-gray-700 hover:bg-green-100"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
