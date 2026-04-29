// This file stores all main theme colours of the app to allow any component to load
export const Colors = {

    // Imported colours
    dark: {
        background: '#1A1F14',      // dark green
        uiBackground: '#242B1D',    // darker green
        iconColor: "#9591a5",       // light blue
        iconColorFocused: "#fff",   // white
        text: '#F0EBE3',            // beighe
        title: '#F0EBE3',
        textSoft: '#9A9088',        // grey
        border: '#2E3828',          // dark green
        green: '#4A7A35',           // lighter green
        greenLight: '#1E2D18',
        terracotta: '#D4703A',
        terracottaLight: '#2D1F18',
        red: '#E05555',
        redLight: '#2D1818',
        amber: '#E08B30',
        amberLight: '#2D2010',
        fresh: '#5FA040',
        freshLight: '#1A2D14',
        warmGray: '#6B6259',
        creamDark: '#1F2419',
    },
    light: {
        background: '#FBF7F2',      // cream
        uiBackground: '#F2EBE1',    // white
        iconColor: "#686477",       // light blue
        iconColorFocused: "#201e2b",// dark blue
        text: '#1C1915',            // dark grey
        title: '#1C1915',
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

        navBackground: "#e8e7ef",
    }
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