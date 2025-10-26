import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import WeatherPage from "./pages/WeatherPage";
import MarketPrices from "./pages/MarketPrice";
import AddSchemaPage from "./pages/Scheme";
import DiseaseDetection from "./pages/DiseaseDetection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route
          path="/dashboard/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/weather"
          element={
            <PrivateRoute>
              <WeatherPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/market"         
          element={
            <PrivateRoute>
              <MarketPrices />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/schemes"         
          element={
            <PrivateRoute>
              <AddSchemaPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/disease"         
          element={
            <PrivateRoute>
              <DiseaseDetection />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
