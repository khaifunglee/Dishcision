// This layout page wraps all auth pages with a stack by rendering the text on top of all pages (e.g by a header/footer)
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'

export default function RootLayout() {

    return (
        <>
            {/* Status bar automatically changes colour of device's header icons along with light/dark theme (e.g service bar, wifi signs, battery) */}
            <StatusBar value="auto" />
            <Stack screenOptions={{
                headerShown: false, animation: "fade_from_bottom"
            }} />
        </>
    )
}