import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",  // ✅ point to Django backend
  withCredentials: true, // if CSRF/session needed
});

export const registerFarmer = (data) => API.post("register/", data);
export const loginFarmer = (data) => API.post("login/", data);
export const getProfile = () => API.get("profile/");
export const updateProfile = (data) => API.put("profile/update/", data);

export async function getFarmProfile(token) {
  const res = await axios.get("http://127.0.0.1:8000/api/farm-profile/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}