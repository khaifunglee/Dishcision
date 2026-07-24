// This file uses React Context to determine global auth state for the whole app
import { createContext, useContext, useEffect, useState } from "react"
import { login, register, logout, getToken, getStoredUser, verifyEmail, resendVerificationCode } from '../api/authApi'
import { setAuthFailureHandler } from '../api/client'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null)     // set token var
    const [user, setUser] = useState(null)       // { name, email }
    const [loading, setLoading] = useState(true) // check stored token on startup

    // Restore token + user info on startup
    useEffect(() => {
        const loadToken = async () => {
            const stored = await getToken()
            const storedUser = await getStoredUser()
            setToken(stored)
            setUser(storedUser)
            setLoading(false)
        }
        loadToken()
    }, [])

    // Register a callback so the axios interceptor can clear auth state on 401
    useEffect(() => {
        setAuthFailureHandler(() => {
            setToken(null)
            setUser(null)
        })
        return () => setAuthFailureHandler(null)
    }, [])

    const handleLogin = async (email, password, rememberMe) => {
        const result = await login(email, password, rememberMe)
        setToken(result.token)
        setUser({ name: result.name, email: result.email })
    }

    // Register does NOT log the user in — account is unverified until the
    // emailed code is confirmed via handleVerifyEmail
    const handleRegister = async (name, email, password) => {
        const result = await register(name, email, password)
        return result
    }

    const handleVerifyEmail = async (email, code) => {
        const result = await verifyEmail(email, code)
        setToken(result.token)
        setUser({ name: result.name, email: result.email })
        return result
    }

    const handleLogout = async () => {
        await logout()
        setToken(null) // remove token after logout
        setUser(null)
    }

    // Update stored user info (e.g. after editing profile name)
    const updateUser = (updatedUser) => {
        setUser(updatedUser)
    }

    return (
        // Context: use const { user, isLoggedIn, login, logout } = useAuth()
        <AuthContext.Provider value={{
            token,
            user,
            loading,                // true = token loaded, false = still checking if token exists
            isLoggedIn: !!token,    // true = token exists, false = no token
            login: handleLogin,
            register: handleRegister,
            verifyEmail: handleVerifyEmail,
            resendVerificationCode,
            logout: handleLogout,
            updateUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
// Custom hook for easy access in any screen to check user state
export const useAuth = () => useContext(AuthContext)
