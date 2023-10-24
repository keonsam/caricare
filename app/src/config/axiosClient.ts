import axios from "axios";
import config from ".";

const axiosClient = axios.create({
  baseURL: config.apiUrl,
});



export default axiosClient;
