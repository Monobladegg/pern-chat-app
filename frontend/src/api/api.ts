import axios from "axios";

const baseAPI = axios.create({
    baseURL: "http://localhost:5000"
});

export default baseAPI;