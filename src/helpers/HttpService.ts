import axios from "axios";
import { getCookie } from "./Credentials";
import { URL_BASE } from "@/config";


const HttpService = axios.create({
    baseURL: URL_BASE,
    timeout: 1000,
});

HttpService.interceptors.request.use(
    request => {
        const token = getCookie('auth_cookie');
        request.headers.Authorization = token ? `Bearer ${token}` : '';
        return request;
    },
    error => {
        return Promise.reject(error)
    }
);

export default HttpService;