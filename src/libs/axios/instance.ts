import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60 * 1000,
});

export default instance;
