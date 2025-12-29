import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_HOST_URL,
	// timeout: 10000,
	headers: {
		// Accept: "application/json",
		"Content-Type": "application/json",
	},
    withCredentials:true
});

export default axiosInstance;