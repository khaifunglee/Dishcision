// This file serves as an API client to send requests and attach the JWT token to every outgoing request
import axios from 'axios' // used to create HTTP client
import * as SecureStore from 'expo-secure-store' // stores JWT token securely on device

// Address to reach Spring Boot server (env-driven, fall back to LAN IP for local dev)
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.1.20:8080'
// Create API client (timeout timer to handle timeouts gracefully)
const client = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: { 'Content-Type': 'application/json' }
})

// Interceptor to attach JWT token to every request header if present
client.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('jwt_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Registered by AuthContext so a 401 also clears in-memory auth state
let _onAuthFailure = null
export const setAuthFailureHandler = (handler) => { _onAuthFailure = handler }

// Interceptor to clear expired token on 401 so the auth layout redirects to login
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.log('Status code 401. Deleting user token.')
            await SecureStore.deleteItemAsync('jwt_token')
            _onAuthFailure?.()
        }
        return Promise.reject(error)
    }
)

export default client