// This dashboard layout page wraps all dashboard pages with a bottom nav bar tab
import { Tabs } from 'expo-router'
import { View, Text, useColorScheme, StyleSheet } from 'react-native'
import { Colors, palette } from '../../constants/colors'
import { Feather } from '@expo/vector-icons'

function TabIcon({ name, label, focused }) {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    return (
        <View style={styles.tabItem}>
            {/* Dynamic icon, use home when tab selected (focused == true), home-outline when not */}
            <Feather
                name={name}
                size={22}
                color={focused ? theme.green : theme.warmGray}
            />
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
                {label}
            </Text>
        </View>
    )
}

const DashboardLayout = () => {
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
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
        fontFamily: 'DMSans_500Medium',
        fontSize: 10,
        color: palette.warmGray,
    },
    tabLabelActive: {
        color: palette.green,
    }
})