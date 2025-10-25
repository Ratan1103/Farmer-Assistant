import axios from "axios";

export const getWeather = async (token) => {
  const res = await axios.get("http://127.0.0.1:8000/api/weather/", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
