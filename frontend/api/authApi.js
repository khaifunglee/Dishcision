// This file contains authentication service wrapper functions to call the API
import client from "./client"
import * as SecureStore from 'expo-secure-store'

// Register POST API — returns { token, name, email }
export const register = async (name, email, password) => {
    console.log('calling register API')
    const response = await client.post('/auth/register', { name, email, password })
    console.log('register response: ', response.data)
    const { token, name: userName, email: userEmail } = response.data

    // Store JWT token, remember me, and user data on device
    await SecureStore.setItemAsync('jwt_token', token)
    await SecureStore.setItemAsync('remember_me', 'true')
    await SecureStore.setItemAsync('user_name', userName)
    await SecureStore.setItemAsync('user_email', userEmail)
    return { token, name: userName, email: userEmail }
}

// Login POST API — returns { token, name, email }
export const login = async (email, password, rememberMe = true) => {
    console.log('calling login API')
    const response = await client.post('/auth/login', { email, password })
    console.log('login response: ', response.data)
    const { token, name, email: userEmail } = response.data

    // Always store token so the current session's requests can attach it.
    // remember_me flag controls whether getToken() returns it on next cold start.
    await SecureStore.setItemAsync('jwt_token', token)
    await SecureStore.setItemAsync('user_name', name)
    await SecureStore.setItemAsync('user_email', userEmail)
    await SecureStore.setItemAsync('remember_me', rememberMe ? 'true' : 'false')
    return { token, name, email: userEmail }
}

// Delete token when on logout (prevents automatic logins)
export const logout = async () => {
    await SecureStore.deleteItemAsync('jwt_token')
    await SecureStore.deleteItemAsync('remember_me')
    await SecureStore.deleteItemAsync('user_name')
    await SecureStore.deleteItemAsync('user_email')
}

export const getToken = async () => {
    const rememberMe = await SecureStore.getItemAsync('remember_me')
    if (rememberMe === 'false') {
        // Non-persistent session ended — clear the ephemeral token on cold start
        await SecureStore.deleteItemAsync('jwt_token')
        await SecureStore.deleteItemAsync('remember_me')
        return null
    }
    return await SecureStore.getItemAsync('jwt_token')
}

// Load persisted user info (name + email) from secure store
export const getStoredUser = async () => {
    const name = await SecureStore.getItemAsync('user_name')
    const email = await SecureStore.getItemAsync('user_email')
    if (!name || !email) return null
    return { name, email }
}
