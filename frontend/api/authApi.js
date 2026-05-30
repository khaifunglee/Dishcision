// This file contains authentication service wrapper functions to call the API
import client from "./client"
import * as SecureStore from 'expo-secure-store'

// Register POST API
export const register = async (name, email, password) => {
    const response = await client.post('/auth/register', { name, email, password })
    const { token } = response.data
    // Store JWT token on device
    await SecureStore.setItemAsync('jwt_token', token)
    await SecureStore.setItemAsync('remember_me', 'true') // Always remember login details upon register
    return token
}

// Login POST API
export const login = async (email, password, rememberMe = true) => {
    console.log('2. calling API')
    const response = await client.post('/auth/login', { email, password })
    console.log('response: ', response.data)
    const { token } = response.data

    // If remember me is checked, store token in memory to persist login. Otherwise, delete the token when app closes
    if (rememberMe) {
        // Store JWT token on device
        await SecureStore.setItemAsync('jwt_token', token)
        await SecureStore.setItemAsync('remember_me', 'true')
    } else {
        await SecureStore.deleteItemAsync('jwt_token')
        await SecureStore.setItemAsync('remember_me', 'false')
    }
    return token
}

// Delete token when logging out (prevents automatic logins)
export const logout = async () => {
    await SecureStore.deleteItemAsync('jwt_token')
    await SecureStore.deleteItemAsync('remember_me')
}

export const getToken = async () => {
    const rememberMe = await SecureStore.getItemAsync('remember_me')
    // If remember_me = false, don't restore token on app launch
    if (rememberMe === 'false') return null
    return await SecureStore.getItemAsync('jwt_token')
}