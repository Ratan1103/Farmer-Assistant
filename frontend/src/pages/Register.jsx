import { useState } from "react";
import { registerFarmer } from "../api/farmerApi";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    aadhaar: "",
    district: "",
    pincode: "",
    land_size: "",
    preferred_language: "English",
    crop: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerFarmer(form);
      alert("🎉 Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        console.error("Validation error:", err.response.data);
        alert(JSON.stringify(err.response.data, null, 2));
      } else {
        alert("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg">
        
        {/* ✅ Logo + Title */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-3xl text-white font-bold">🌿</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-700">Farmer Assistant</h1>
              <p className="text-gray-500 text-sm">Smart Farming Solutions</p>
            </div>
          </div>
          <p className="text-gray-600">Join thousands of farmers growing smarter 🚜</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">👤 Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaar"
                  value={form.aadhaar}
                  onChange={handleChange}
                  placeholder="12-digit Aadhaar"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h2 className="text-xl font-semibold mb-3">🔑 Security</h2>
            <div>
              <label className="block text-sm font-medium text-gray-600">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full p-3 border rounded-lg"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-3">📍 Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">District</label>
                <input
                  type="text"
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  placeholder="Enter district"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Farm Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">🌾 Farm Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Land Size (in acres)</label>
                <input
                  type="text"
                  name="land_size"
                  value={form.land_size}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Preferred Language</label>
                <select
                  name="preferred_language"
                  value={form.preferred_language}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Telugu</option>
                  <option>Tamil</option>
                  <option>Marathi</option>
                </select>
              </div>
            </div>

            {/* Crops single select */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-600">Select Crop</label>
              <select
                name="crop"
                value={form.crop}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">-- Select Crop --</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="tomato">Tomato</option>
                <option value="potato">Potato</option>
                <option value="onion">Onion</option>
                <option value="maize">Maize</option>
                <option value="sugarcane">Sugarcane</option>
                <option value="cotton">Cotton</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {/* Extra Links */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>

        {/* Small Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="mt-2 text-sm text-gray-500 hover:text-green-700 transition flex gap-1 mx-auto"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
