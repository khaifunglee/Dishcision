// This file stores the user dark mode and text size preferences globally
import { createContext, useContext, useState, useEffect } from "react"
import * as SecureStore from 'expo-secure-store'

const ThemeContext = createContext()

// Font scale multipliers for text size setting
export const TEXT_SCALE = {
    SMALL: 0.85,
    MEDIUM: 1.0,
    LARGE: 1.2,
}

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(false)
    const [textSize, setTextSizeState] = useState('MEDIUM') // medium on default

    // Load saved preferences on startup
    useEffect(() => {
        const load = async () => {
            const [savedDark, savedTextSize] = await Promise.all([
                SecureStore.getItemAsync('dark_mode'),
                SecureStore.getItemAsync('text_size'),
            ])
            if (savedDark === 'true') setIsDark(true)
            if (savedTextSize) setTextSizeState(savedTextSize)
        }
        load()
    }, [])

    const toggleTheme = async () => {
        const next = !isDark
        setIsDark(next)
        await SecureStore.setItemAsync('dark_mode', String(next))
    }

    // Sets text size in context (for immediate effect) and persists to SecureStore
    const setTextSize = async (size) => {
        setTextSizeState(size)
        await SecureStore.setItemAsync('text_size', size)
    }

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, textSize, setTextSize }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)