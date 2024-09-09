import axios from "axios";

const baseAPI = axios.create({
    baseURL: "http://localhost:5001"
});

export default baseAPI;