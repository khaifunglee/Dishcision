// This file stores the user dark mode preference to apply it across all pages
import { createContext, useContext, useState, useEffect } from "react"
import * as SecureStore from 'expo-secure-store'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false)

    // Load saved preference on startup
    useEffect(() => {
        const load = async () => {
            const saved = await SecureStore.getItemAsync('dark_mode')
            if (saved === 'true') setIsDark(true)
        }
        load()
    }, [])
    // Toggle theme function
    const toggleTheme = async () => {
        const next = !isDark
        setIsDark(next)
        await SecureStore.setItemAsync('dark_mode', String(next))
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)