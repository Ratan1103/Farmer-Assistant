import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");  // ✅ use "access"
  return token ? children : <Navigate to="/login" />;
}
