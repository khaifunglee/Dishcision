// Root layout of app: wrap all pages with a stack (e.g header) and handle navigation based on auth state
// Stack also allows for navigation (e.g adds back button to return to most recent page)
import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { StatusBar, useColorScheme } from 'react-native'
import { AuthProvider, useAuth } from '../context/AuthContext' // used to check user logged in state in every page
import { ThemeProvider } from '../context/ThemeContext' // used to return light/dark themed pages on device with userInterfaceSytle in app.json

// Design
import { Colors } from "../constants/colors"
import { useFonts } from 'expo-font'
import { Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces'
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans'
import * as SplashScreen from 'expo-splash-screen'

// Keep splash screen visible until resources are loaded (fonts & auth context)
SplashScreen.preventAutoHideAsync()

function RootLayout() {

    const { isLoggedIn, loading } = useAuth()

    const [fontsLoaded, fontError] = useFonts({
        Fraunces_400Regular,
        Fraunces_600SemiBold,
        Fraunces_400Regular_Italic,
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_600SemiBold,
    })
    // Hide splash once fonts are loaded/failed
    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync()
        }
    }, [fontsLoaded, fontError])

    // Hook to check if user is logged in
    useEffect(() => {
        if (loading || !fontsLoaded) return // Still checking stored token, wait
        // If already logged in, redirect to home page, otherwise redirect to login page
        if (isLoggedIn) {
            router.replace('/(dashboard)/home')
        } else {
            router.replace('/')
        }
    }, [isLoggedIn, loading, fontsLoaded])

    if (!fontsLoaded && !fontError) return null

    return (
        <>
            {/* Status bar automatically changes colour of device's header icons along with light/dark theme (e.g service bar, wifi signs, battery) */}
            <StatusBar value="auto" />
            <Stack screenOptions={{ headerShown: false, animation: "default", animationDuration: 200, }}>
                {/* Register each screen as a stack to allow for customizability in 'options', e.g title, headerShown: true/false */}
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(dashboard)" />
                <Stack.Screen name="recipe-detail" />
                <Stack.Screen name="suggestions" />
            </Stack>
        </>
    )
}
export default function Layout() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <RootLayout />
            </AuthProvider>
        </ThemeProvider>
    )
}