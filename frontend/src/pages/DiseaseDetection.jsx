import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";

export default function DiseaseDetection() {
  const [user, setUser] = useState(null);
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [cropType, setCropType] = useState("wheat");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access");

  // Fetch user + history
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    if (token) fetchHistory();
  }, []);

  // Fetch history + stats
  const fetchHistory = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/disease/history/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load history");
      const data = await res.json();
      setDiagnosisHistory(data.history || []);
      setStats(data.stats || {});
    } catch (err) {
      setError(err.message);
    }
  };

  // File Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Analyze Image
  const handleAnalyzeImage = async () => {
    if (!imageFile) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("crop_type", cropType);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/disease/diagnose/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to analyze image");
      const data = await res.json();

      setDiagnosisHistory([data, ...diagnosisHistory]);
      setSelectedDiagnosis(data);
      setUploadMode(false);
      setImagePreview(null);
      setImageFile(null);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Safe date parser
  const formatDate = (dateStr, showTime = false) => {
    if (!dateStr) return "Unknown";
    let iso = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T");
    const d = new Date(iso);
    if (isNaN(d)) return dateStr;

    return showTime
      ? d.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : d.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Crop Disease Detection</h1>
            <p className="text-gray-600">
              AI-powered disease diagnosis for your crops
            </p>
          </div>
          {!uploadMode && (
            <button
              onClick={() => setUploadMode(true)}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
            >
              Analyze Crop Image
            </button>
          )}
        </div>

        {/* Upload Section */}
        {uploadMode && (
          <div className="bg-white rounded-xl shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Upload Crop Image</h2>
            <div className="space-y-6">
              {/* File Upload */}
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      onClick={() => setImagePreview(null)}
                      className="text-green-700"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-4xl mb-2">📸</div>
                      <p className="font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </label>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAnalyzeImage}
                  disabled={!imageFile || analyzing}
                  className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
                >
                  {analyzing ? "Analyzing..." : "Analyze Image"}
                </button>
                <button
                  onClick={() => setUploadMode(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {!uploadMode && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-sm text-gray-500">Total Scans</p>
              <p className="text-3xl font-bold">{stats.total || 0}</p>
              <p className="text-gray-500 text-sm">Crop analyses performed</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-sm text-gray-500">Healthy Crops</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.healthy || 0}
              </p>
              <p className="text-gray-500 text-sm">No disease detected</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-sm text-gray-500">Avg Confidence</p>
              <p className="text-3xl font-bold">{stats.avgConfidence || 0}%</p>
              <p className="text-gray-500 text-sm">Diagnosis accuracy</p>
            </div>
          </div>
        )}

        {/* Selected Diagnosis */}
        {selectedDiagnosis && (
          <div className="bg-green-50 rounded-xl shadow p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Latest Diagnosis Result</h2>
              <button
                onClick={() => setSelectedDiagnosis(null)}
                className="text-gray-400 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {selectedDiagnosis.image && (
                <img
                  src={selectedDiagnosis.image}
                  alt="Analyzed crop"
                  className="rounded-lg w-full max-h-96 object-cover"
                />
              )}
              <div className="space-y-6">
                <p className="text-lg font-semibold">
                  Crop Type: {selectedDiagnosis.cropType}
                </p>
                <p className="text-2xl font-bold">
                  {selectedDiagnosis.disease_name}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Confidence</p>
                    <p>{selectedDiagnosis.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Severity</p>
                    <span>{selectedDiagnosis.severity}</span>
                  </div>
                </div>

                <p>
                  Scanned on{" "}
                  {formatDate(
                    selectedDiagnosis.timestamp ||
                      selectedDiagnosis.display_date
                  )}{" "}
                  at{" "}
                  {formatDate(
                    selectedDiagnosis.timestamp ||
                      selectedDiagnosis.display_date,
                    true
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Diagnosis History */}
        {!uploadMode && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Diagnosis History</h2>
            <div className="space-y-4">
              {diagnosisHistory.length === 0 ? (
                <p className="text-gray-500">No history yet.</p>
              ) : (
                diagnosisHistory.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDiagnosis(d)}
                    className="p-4 border rounded-lg hover:border-green-500 cursor-pointer flex justify-between items-center"
                  >
                    {/* Left side */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">
                          {d.disease_name || d.disease}
                        </p>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            d.severity === "severe"
                              ? "bg-red-100 text-red-700"
                              : d.severity === "moderate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {d.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {d.cropType} • {formatDate(d.timestamp)} • Confidence:{" "}
                        {d.confidence}%
                      </p>
                    </div>

                    {/* Right side: clock + time */}
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <span className="text-lg">⏰</span>
                      {formatDate(d.timestamp, true)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Common Crop Diseases */}
        {!uploadMode && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Common Crop Diseases</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { name: "Powdery Mildew", crops: "Wheat, Barley", icon: "🍂" },
                { name: "Leaf Blast", crops: "Rice, Wheat", icon: "🌾" },
                { name: "Early Blight", crops: "Potato, Tomato", icon: "🥔" },
                { name: "Rust", crops: "Wheat, Barley", icon: "🔴" },
                { name: "Anthracnose", crops: "Cotton, Chili", icon: "🌶️" },
                { name: "Bacterial Wilt", crops: "Tomato, Pepper", icon: "🍅" },
              ].map((d, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 border rounded-lg hover:shadow"
                >
                  <span className="text-3xl">{d.icon}</span>
                  <div>
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-sm text-gray-500">Affects: {d.crops}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
