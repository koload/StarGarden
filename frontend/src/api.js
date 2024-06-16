import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

// adding authorization token to header "Authorization"
// in every axios request if the token exists in local storage
// the first function is called when the request is being
// proccessed succesfully and the second function
// when there is an error
api.interceptors.request.use(
    (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
    config.headers.Authorization = `Bearer ${token}`}
    return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api