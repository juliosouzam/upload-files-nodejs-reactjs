import axios from "axios";

const api = axios.create({
  baseURL: "",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const isAuthenticated = async () => {
  let token = localStorage.getItem("hash");
  if (!token || token === undefined) {
    return false;
  }

  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const response = await api.get("user");

  if (!response.data) {
    return false;
  }

  return true;
};
