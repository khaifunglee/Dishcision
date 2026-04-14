// This dashboard layout page wraps all dashboard pages with a bottom nav bar tab
import { Tabs } from 'expo-router'
import { useColorScheme } from 'react-native'
import { Colors } from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons'

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
            {/* Dynamic icon, use home when tab selected (focused == true), home-outline when not */}
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home", tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? 'home' : 'home-outline'}
                            color={focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="pantry"
                options={{
                    title: "Pantry", tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? 'folder' : 'folder-outline'}
                            color={focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="recipes"
                options={{
                    title: "Recipes", tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? 'book' : 'book-outline'}
                            color={focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile", tabBarIcon: ({ focused }) => (
                        <Ionicons
                            size={24}
                            name={focused ? 'person' : 'person-outline'}
                            color={focused ? theme.iconColorFocused : theme.iconColor}
                        />
                    )
                }}
            />
        </Tabs>
    )
}
export default DashboardLayout