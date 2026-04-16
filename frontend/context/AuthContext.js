// This file uses React Context to determine global auth state for the whole app
import { createContext, useContext, useEffect, useState } from "react"
import { login, register, logout, getToken } from '../api/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null) // hook to set token var
    const [loading, setLoading] = useState(true) // check stored token on startup

    // Check if a token already exists on app startup (if yes means user already logged in)
    useEffect(() => {
        const loadToken = async () => {
            const stored = await getToken()
            setToken(stored)
            setLoading(false)
        }
        loadToken()
    }, [])
    // Otherwise, set token during login/register
    const handleLogin = async (email, password) => {
        const t = await login(email, password)
        setToken(t)
    }

    const handleRegister = async (name, email, password) => {
        const t = await register(name, email, password)
        setToken(t)
    }
    // Remove token if logout
    const handleLogout = async () => {
        await logout()
        setToken(null)
    }

    return (
        // Context: use const { isLoggedIn, login, logout } = useAuth()
        <AuthContext.Provider value={{
            token,
            loading, // true = token loaded, false = still checking if token exists
            isLoggedIn: !!token, // true = token exists, false = no token present
            login: handleLogin,
            register: handleRegister,
            logout: handleLogout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook for easy access in any screen to check user state
export const useAuth = () => useContext(AuthContext)