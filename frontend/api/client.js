// This file serves as an API client by attaching the JWT token to every outgoing request
import axios from 'axios' // used to create HTTP client
import * as SecureStore from 'expo-secure-store' // stores JWT token securely on device

// Address to reach Spring Boot server
const BASE_URL = 'http://192.168.1.17:8080'
// Create API client
const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
})

// Automatically attach JWT token to every request if present
client.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('jwt_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default client