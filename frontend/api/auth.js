// This file contains authentication service wrapper functions to call the API
import client from "./client"
import * as SecureStore from 'expo-secure-store'

// Register POST API
export const register = async (name, email, password) => {
    const response = await client.post('/auth/register', { name, email, password })
    const { token } = response.data
    // Store JWT token on device
    await SecureStore.setItemAsync('jwt_token', token)
    return token
}

// Login POST API
export const login = async (email, password) => {
    const response = await client.post('/auth/login', { email, password })
    const { token } = response.data
    // Store JWT token on device
    await SecureStore.setItemAsync('jwt_token', token)
    return token
}

// Delete token when logging out (prevents automatic logins)
export const logout = async () => {
    await SecureStore.deleteItemAsync('jwt_token')
}

export const getToken = async () => {
    return await SecureStore.getItemAsync('jwt_token')
}