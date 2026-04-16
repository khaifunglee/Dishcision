// Root layout of app: wrap all pages with a stack (e.g header) and handle navigation based on auth state
// Stack also allows for navigation (e.g adds back button to return to most recent page)
import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { StatusBar, useColorScheme } from 'react-native' // used to return light/dark themed pages on device with userInterfaceSytle in app.json
import { Colors } from "../constants/colors"
import { AuthProvider, useAuth } from '../context/AuthContext' // used to check user logged in state in every page

function RootLayout = () => {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light

    const { isLoggedIn, loading } = useAuth()

    // Hook to check if user is logged in
    useEffect(() => {
        if (loading) return // Still checking stored token, wait
        // If already logged in, redirect to home page, otherwise redirect to login page
        if (isLoggedIn) {
            router.replace('/(dashboard)/home')
        } else {
            router.replace('/(auth)/login')
        }
    }, [isLoggedIn, loading])

    return (
        <>
            {/* Status bar automatically changes colour of device's header icons along with light/dark theme (e.g service bar, wifi signs, battery) */}
            <StatusBar value="auto" />
            <Stack screenOptions={{
                headerStyle: { backgroundColor: theme.navBackground },
                headerTintColor: theme.title,
            }}>
                {/* Register each screen as a stack to allow for customizability in 'options', e.g title, headerShown: true/false */}
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
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