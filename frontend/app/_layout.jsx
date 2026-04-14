// This root layout page wraps all pages with a stack by rendering the text on top of all pages (e.g by a header/footer)
// Stack also allows for navigation (e.g adds back button to return to most recent page)
import { Stack } from 'expo-router'
import { StatusBar, useColorScheme } from 'react-native' // used to return light/dark themed pages on device with userInterfaceSytle in app.json
import { Colors } from "../constants/colors"

const RootLayout = () => {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light

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
export default RootLayout