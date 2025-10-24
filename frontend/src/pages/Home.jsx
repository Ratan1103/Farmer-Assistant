import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  // Scroll down to features section
  const handleScroll = () => {
    const section = document.getElementById("features-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center fade-in">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground mb-6">
          Smart Farming Solutions for{" "}
          <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-green-700 bg-clip-text text-transparent">
            Modern Farmers
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get real-time weather updates, market prices, government schemes, and
          AI-powered crop disease diagnosis all in one place.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup">
            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all cursor-pointer">
              Get Started Free
            </button>
          </Link>
          <button
            onClick={handleScroll}
            className="px-6 py-3 border border-green-600 text-green-700 rounded-lg hover:bg-green-50 transition-smooth cursor-pointer"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features-section"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <h2 className="text-4xl font-bold text-center text-foreground mb-16">
          Why Choose Farmer Assistant?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: "🌤️",
              title: "Weather Forecasts",
              text: "Get accurate weather predictions for your region to plan your farming activities better.",
            },
            {
              icon: "💰",
              title: "Market Prices",
              text: "Track real-time market prices for your crops and make informed selling decisions.",
            },
            {
              icon: "📋",
              title: "Government Schemes",
              text: "Discover and apply for government subsidies and schemes available for farmers.",
            },
            {
              icon: "🔬",
              title: "Disease Detection",
              text: "Use AI to identify crop diseases early and get treatment recommendations.",
            },
            {
              icon: "🌍",
              title: "Multilingual Support",
              text: "Access the platform in your preferred language for better understanding.",
            },
            {
              icon: "🤖",
              title: "AI Assistant",
              text: "Chat with our AI assistant for farming advice and quick answers to your questions.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-gradient-to-br from-white to-green-50 border border-border shadow-md hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-green-100 via-green-50 to-white rounded-2xl p-12 text-center shadow-lg border border-green-200">
          <h2 className="text-4xl font-extrabold text-green-800 mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-green-700 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers already using Farmer Assistant to improve
            their yields and income.
          </p>
          <Link to="/signup">
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-semibold rounded-lg shadow-md hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-emerald-500 transition-all cursor-pointer">
              Start Your Free Account
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
