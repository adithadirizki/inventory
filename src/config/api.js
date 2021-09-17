import axios from "axios";

// export const ENDPOINT = "http://localhost:5000";
export const ENDPOINT = "https://inventory-mern-app.herokuapp.com";

export default axios.create({
  baseURL: ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
});
