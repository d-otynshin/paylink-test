import axios from "axios";

export const api = axios.create({
  baseURL: "https://api.example.com", // Replace with your real API
  timeout: 5000,
});

export const fetchDevices = async () => {
  const { data } = await api.get("/devices");
  return data;
};

export const deleteDevice = async (id: number) => {
  await api.delete(`/devices/${id}`);
};
