import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/farmerApi";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateProfile(profile);
      alert("Profile updated!");
    } catch (err) {
      alert("Error updating profile.");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <input className="w-full p-2 border rounded mb-2" name="district" value={profile.district} onChange={handleChange} />
      <input className="w-full p-2 border rounded mb-2" name="pincode" value={profile.pincode} onChange={handleChange} />
      <input className="w-full p-2 border rounded mb-2" name="land_size" value={profile.land_size} onChange={handleChange} />
      <button onClick={handleUpdate} className="w-full bg-green-600 text-white p-2 rounded">Update Profile</button>
    </div>
  );
}
