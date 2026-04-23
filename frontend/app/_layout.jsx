// Root layout of app: wrap all pages with a stack (e.g header) and handle navigation based on auth state
// Stack also allows for navigation (e.g adds back button to return to most recent page)
import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { StatusBar, useColorScheme } from 'react-native' // used to return light/dark themed pages on device with userInterfaceSytle in app.json
import { AuthProvider, useAuth } from '../context/AuthContext' // used to check user logged in state in every page

// Design
import { Colors } from "../constants/colors"
import { useFonts } from 'expo-font'
import { Fraunces_400Regular, Fraunces_600SemiBold, Fraunces_400Regular_Italic } from '@expo-google-fonts/fraunces'
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans'
import * as SplashScreen from 'expo-splash-screen'

// Keep splash screen visible until resources are loaded (fonts & auth context)
SplashScreen.preventAutoHideAsync()

function RootLayout() {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light

    const { isLoggedIn, loading } = useAuth()

    const [fontsLoaded] = useFonts({
        Fraunces_400Regular,
        Fraunces_600SemiBold,
        Fraunces_400Regular_Italic,
        DMSans_400Regular,
        DMSans_500Medium,
        DMSans_600SemiBold,
    })

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync()
    }, [fontsLoaded])

    // Hook to check if user is logged in
    useEffect(() => {
        if (loading || !fontsLoaded) return // Still checking stored token, wait
        // If already logged in, redirect to home page, otherwise redirect to login page
        if (isLoggedIn) {
            router.replace('/(dashboard)/home')
        } else {
            router.replace('/')
        }
    }, [isLoggedIn, loading])

    return (
        <>
            {/* Status bar automatically changes colour of device's header icons along with light/dark theme (e.g service bar, wifi signs, battery) */}
            <StatusBar value="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                {/* Register each screen as a stack to allow for customizability in 'options', e.g title, headerShown: true/false */}
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(dashboard)" />
            </Stack>
        </>
    )
}
export default function Layout() {
    return (
        <AuthProvider>
            <RootLayout />
        </AuthProvider>
    )
}