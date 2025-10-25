"use client"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ instead of next/navigation
import DashboardLayout from "../components/DashboardLayout";  // ✅ relative path, default export
import { Card } from "../components/ui/card";     // ✅ update to your real folder structure
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import axios from "axios";


export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);   // ❌ remove :any
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(null);  // ❌ remove :any
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    async function fetchProfile() {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [navigate, token]);


  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};


  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await axios.put("http://127.0.0.1:8000/api/profile/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(res.data)
      setFormData(res.data)
      setEditing(false)
    } catch (err) {
      console.error("Profile update failed:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout userName={user?.full_name} onLogout={handleLogout}>
      <div className="space-y-8 max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Profile</h1>
            <p className="text-muted-foreground">Manage your farm details and account settings</p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)} className="bg-primary hover:bg-primary/90">
              Edit Profile
            </Button>
          )}
        </div>

        {/* Profile Card */}
        <Card className="p-8 border border-border">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Full Name</label>
                  {editing ? (
                    <Input type="text" name="full_name" value={formData?.full_name || ""} onChange={handleChange} />
                  ) : (
                    <p className="text-lg">{user?.full_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Phone</label>
                  <p className="text-lg">{user?.phone}</p> {/* phone is not editable */}
                </div>

                <div>
                  <label className="block text-sm font-medium">Email</label>
                  {editing ? (
                    <Input type="email" name="email" value={formData?.email || ""} onChange={handleChange} />
                  ) : (
                    <p className="text-lg">{user?.email || "Not specified"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Farm Information */}
            <div className="border-t border-border pt-6">
              <h2 className="text-2xl font-bold mb-6">Farm Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">District</label>
                  {editing ? (
                    <Input type="text" name="district" value={formData?.district || ""} onChange={handleChange} />
                  ) : (
                    <p className="text-lg">{user?.district || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Pincode</label>
                  {editing ? (
                    <Input type="text" name="pincode" value={formData?.pincode || ""} onChange={handleChange} />
                  ) : (
                    <p className="text-lg">{user?.pincode || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Farm Size (acres)</label>
                  {editing ? (
                    <Input type="text" name="land_size" value={formData?.land_size || ""} onChange={handleChange} />
                  ) : (
                    <p className="text-lg">{user?.land_size || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Active Crop</label>
                  {editing ? (
                    <Input type="text" name="crop" value={formData?.crop || ""} onChange={handleChange} />
                  ) : (
                    <p className="text-lg">{user?.crop || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium">Preferred Language</label>
                  {editing ? (
                    <Input type="text" name="preferred_language" value={formData?.preferred_language || ""} onChange={handleChange} />
                  ) : (
                    <p className="text-lg">{user?.preferred_language}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {editing && (
              <div className="border-t border-border pt-6 flex gap-4">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => {
                    setEditing(false)
                    setFormData(user)
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
