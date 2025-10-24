import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Logo />

        {/* Links */}
        <div className="flex gap-6 font-medium">
          <Link to="/" className="px-3 py-2 rounded-md hover:bg-green-100 transition cursor-pointer">
            Home
          </Link>
          <Link to="/about" className="px-3 py-2 rounded-md hover:bg-green-100 transition cursor-pointer">
            About
          </Link>
          <Link to="/contact" className="px-3 py-2 rounded-md hover:bg-green-100 transition cursor-pointer">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 border rounded-lg hover:bg-green-50 transition">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
