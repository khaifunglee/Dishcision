// This dashboard layout page wraps all dashboard pages with a bottom nav bar tab
import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/colors'

const DashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: theme.navBackground, paddingTop: 10, height: 90 },
                tabBarActiveTintColor: theme.iconColorFocused,
                tabBarInactiveTintColor: theme.iconColor
            }}
        >
            <Tabs.Screen
                name="profile"
                options={{ title: "Profile" }}
            />
            <Tabs.Screen
                name="home"
                options={{ title: "Home" }}
            />
            <Tabs.Screen
                name="pantry"
                options={{ title: "Pantry" }}
            />
            <Tabs.Screen
                name="recipes"
                options={{ title: "Recipes" }}
            />
        </Tabs>
    )
}
export default DashboardLayout