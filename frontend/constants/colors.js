// This file stores all main theme colours of the app to allow any component to load
import { useTheme } from "../context/ThemeContext"

export const Colors = {

    // Imported colours
    light: {
        background: '#FBF7F2',      // cream
        uiBackground: '#FFF',       // white
        text: '#1C1915',            // dark grey
        textSoft: '#6B6259',        // light grey
        border: '#EAE3DC',          // beige
        green: '#243D1A',
        greenLight: '#EBF2E6',
        terracotta: '#C05C2A',
        terracottaLight: '#FAEEE7',
        red: '#C94040',
        redLight: '#FDEAEA',
        amber: '#D97E20',
        amberLight: '#FEF3E6',
        fresh: '#4A8A2E',
        freshLight: '#EAF4E4',
        warmGray: '#8A7E74',
        creamDark: '#F2EBE1',

        iconColor: "#686477",       // light blue
        iconColorFocused: "#201e2b",// dark blue
        navBackground: "#e8e7ef",
    },
    dark: {
        background: '#161B11',      // screen bg (deep green)
        uiBackground: '#759141',    // card bg (warmer green)
        border: '#5e7533',          // card border (dark green)

        text: '#F2EDE4',            // normal text (cream)
        textSoft: '#D2CEC6',        // subtitles (warm grey)

        // Key colours
        green: '#C05C2A',           // signature colour (flip to terracotta)
        greenLight: '#56923e',      // compliments green
        terracotta: '#D4703A',
        terracottaLight: '#2D1F18',

        red: '#F76460',             // failure colour
        redLight: '#2D1818',        // compliments failure colour
        amber: '#E08B30',           // partial match colour
        amberLight: '#2D2010',      // compliments partial match colour
        fresh: '#91F562',           // match colour
        freshLight: '#1A2D14',      // compliments match colour

        warmGray: '#6B6259',
        creamDark: '#43413E',
        iconColor: "#9591A5",       // light blue
        iconColorFocused: "#FFF",   // white
    },
}
// Use this for brand colours (same regardless of theme)
export const palette = {
    terracotta: '#C05C2A',
    greenLight: '#EBF2E6',
    green: '#243D1A',            // forest green
    warmGray: '#6B6259',
    amberLight: '#FEF3E6',
    terracottaLight: '#FAEEE7',
    freshLight: '#EAF4E4',
    redLight: '#FDEAEA',
    red: '#C94040',
    amber: '#D97E20',
    amberLight: '#FEF3E6',
    fresh: '#4A8A2E',
    freshLight: '#EAF4E4',
    beige: '#EAE3DC',            // beige
    creamDark: '#F2EBE1',
}

export const radius = {
    small: 12,
    medium: 16,
    large: 20,
    full: 100
}

export const shadow = {
    small: {
        shadowColor: '#243D1A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    large: {
        shadowColor: '#243D1A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.14,
        shadowRadius: 16,
        elevation: 6,
    }
}

// Hook for every screen to use correct colour theme based on ThemeContext
export const useAppColors = () => {
    const { isDark } = useTheme()
    return isDark ? Colors.dark : Colors.light
}