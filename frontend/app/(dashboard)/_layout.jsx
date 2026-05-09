// This dashboard layout page wraps all dashboard pages with a bottom nav bar tab
import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { useTheme } from '../../context/ThemeContext'
import { Colors } from '../../constants/colors'
import { Feather } from '@expo/vector-icons'

// Themed components
import ThemedText from '../../components/ThemedText'

function TabIcon({ name, label, focused }) {
    // Select light/dark colour theme from colors.js based on settings toggle
    const { isDark } = useTheme()
    const theme = isDark ? Colors.dark : Colors.light
    return (
        <View style={styles.tabItem}>
            {/* Dynamic icon, use home when tab selected (focused == true), home-outline when not */}
            <Feather
                name={name}
                size={22}
                color={focused ? theme.green : theme.textSoft}
            />
            <ThemedText style={[styles.tabLabel, focused && { color: theme.green }]}>
                {label}
            </ThemedText>
        </View>
    )
}

const DashboardLayout = () => {
    // Select light/dark colour theme from colors.js based on settings toggle
    const { isDark } = useTheme()
    const theme = isDark ? Colors.dark : Colors.light

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                animation: 'shift',
                tabBarStyle: {
                    backgroundColor: theme.background,
                    borderTopColor: theme.border,
                    borderTopWidth: 1,
                    paddingTop: 14, height: 90,
                    marginTop: -34,
                },
                tabBarActiveTintColor: theme.iconColorFocused,
                tabBarInactiveTintColor: theme.iconColor,
                tabBarShowLabel: false,
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home", tabBarIcon: ({ focused }) => (
                        <TabIcon name="home" label="Home" focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name="pantry"
                options={{
                    title: "Pantry", tabBarIcon: ({ focused }) => (
                        <TabIcon name="folder" label="Pantry" focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name="recipes"
                options={{
                    title: "Recipes", tabBarIcon: ({ focused }) => (
                        <TabIcon name="book-open" label="Recipes" focused={focused} />
                    )
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile", tabBarIcon: ({ focused }) => (
                        <TabIcon name="user" label="Profile" focused={focused} />
                    )
                }}
            />
        </Tabs>
    )
}
export default DashboardLayout

const styles = StyleSheet.create({
    tabItem: {
        alignItems: 'center',
        width: 48,
        gap: 6,
    },
    tabLabel: {
        fontSize: 10,
    },
})