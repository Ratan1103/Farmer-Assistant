"use client"

import { useState } from "react"
import  DashboardLayout  from "../components/DashboardLayout"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"

const schemesData = [
  {
    id: 1,
    name: "PM Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Direct income support scheme providing financial assistance to all landholding farmer families across the country.",
    benefits: ["₹6,000 per year in three equal installments", "Direct transfer to bank account"],
    subsidy: "₹6,000/year",
    deadline: "Ongoing",
    status: "active",
    applied: true,
    icon: "💰",
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Crop insurance scheme to protect farmers against crop loss due to natural calamities.",
    benefits: ["Coverage against crop failure", "Claim settlement within 2 months"],
    subsidy: "Up to 50% premium subsidy",
    deadline: "Before sowing season",
    status: "active",
    applied: false,
    icon: "🛡️",
  },
  {
    id: 3,
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Provides soil testing and health cards to farmers for better crop management.",
    benefits: ["Free soil testing", "Personalized recommendations"],
    subsidy: "100% free service",
    deadline: "Ongoing",
    status: "active",
    applied: true,
    icon: "🧪",
  },
  {
    id: 4,
    name: "Pradhan Mantri Krishi Sinchayee Yojana",
    ministry: "Ministry of Jal Shakti",
    description:
      "Irrigation scheme to improve water use efficiency and increase agricultural productivity.",
    benefits: ["Subsidized irrigation infrastructure", "Drip and sprinkler systems"],
    subsidy: "Up to 80% subsidy",
    deadline: "2025-03-31",
    status: "active",
    applied: false,
    icon: "💧",
  },
  {
    id: 5,
    name: "Paramparagat Krishi Vikas Yojana",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Promotes organic farming through cluster approach and certification.",
    benefits: ["Financial assistance for organic farming", "Training and certification support"],
    subsidy: "Up to ₹50,000 per hectare",
    deadline: "2025-12-31",
    status: "active",
    applied: false,
    icon: "🌱",
  },
  {
    id: 6,
    name: "Kisan Credit Card Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    description:
      "Provides farmers with timely access to credit for agricultural needs.",
    benefits: ["Low interest rates", "Flexible repayment schedule"],
    subsidy: "Subsidized credit up to ₹3 lakh",
    deadline: "Ongoing",
    status: "active",
    applied: false,
    icon: "💳",
  },
  {
    id: 7,
    name: "Rashtriya Gokul Mission",
    ministry: "Ministry of Fisheries, Animal Husbandry & Dairying",
    description: "Scheme for conservation and development of indigenous cattle breeds.",
    benefits: ["Subsidy on cattle purchase", "Training on dairy farming"],
    subsidy: "Up to ₹1 lakh per animal",
    deadline: "2025-04-30",
    status: "upcoming",
    applied: false,
    icon: "🐄",
  },
  {
    id: 8,
    name: "Pradhan Mantri Matsya Sampada Yojana",
    ministry: "Ministry of Fisheries, Animal Husbandry & Dairying",
    description: "Fisheries sector development scheme for sustainable aquaculture.",
    benefits: ["Subsidy on pond construction", "Training programs"],
    subsidy: "Up to 60% subsidy",
    deadline: "2025-05-31",
    status: "upcoming",
    applied: false,
    icon: "🐟",
  },
]

export default function SchemesPage() {
  const [filter, setFilter] = useState("all")
  const [user] = useState(JSON.parse(localStorage.getItem("user") || "{}"))

  const filteredSchemes =
    filter === "all" ? schemesData : schemesData.filter((s) => s.status === filter)

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <DashboardLayout userName={user?.fullName} onLogout={handleLogout}>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Government Schemes</h1>
          <p className="text-gray-500">
            Explore and apply for government subsidies and schemes
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <h2 className="text-3xl font-bold">{schemesData.length}</h2>
            <p className="text-gray-500">Total Schemes</p>
          </Card>
          <Card className="p-6 text-center">
            <h2 className="text-3xl font-bold text-green-700">
              {schemesData.filter((s) => s.applied).length}
            </h2>
            <p className="text-gray-500">Applied Schemes</p>
          </Card>
          <Card className="p-6 text-center">
            <h2 className="text-3xl font-bold text-green-700">₹2.5L+</h2>
            <p className="text-gray-500">Potential Benefits</p>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3">
          {["all", "active", "upcoming", "closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === tab
                  ? tab === "upcoming"
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card
              key={scheme.id}
              className="p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{scheme.icon}</span>
                  <div>
                    <h2 className="text-lg font-semibold">{scheme.name}</h2>
                    <p className="text-sm text-gray-500">{scheme.ministry}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    scheme.status === "active"
                      ? "bg-green-100 text-green-700"
                      : scheme.status === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600">{scheme.description}</p>

              {/* Key Benefits */}
              <div className="mt-4">
                <p className="text-sm font-semibold mb-1">Key Benefits:</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 leading-relaxed">
                  {scheme.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Subsidy & Deadline */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <div>
                  <p className="font-medium">Subsidy</p>
                  <p className="font-bold">{scheme.subsidy}</p>
                </div>
                <div>
                  <p className="font-medium">Deadline</p>
                  <p className="font-bold">{scheme.deadline}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <Button variant="outline" className="flex-1">
                  View Details
                </Button>
                {scheme.applied ? (
                  <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                    Applied
                  </Button>
                ) : (
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                    Apply Now
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
