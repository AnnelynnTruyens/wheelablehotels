import axios from "axios";

export const API = axios.create({
	baseURL: process.env.VITE_SERVER_URL as string,
});
