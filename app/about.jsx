// This file represents the About page component
import { StyleSheet, Text, View, Image } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages
import { useColorScheme } from 'react-native' // used to return light/dark themed pages on device with userInterfaceSytle in app.json
import { Colors } from "../constants/colors"
// Themed components
import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"
import Spacer from "../components/Spacer"

const About = () => {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light

    return (
        <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
            <ThemedText style={styles.title}>About Page</ThemedText>
            <Spacer />

            <Link href="/" asChild>
                <ThemedText style={styles.link}>Back Home</ThemedText>
            </Link>
        </ThemedView>
    )
}

export default About

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    link: {
        marginVertical: 10,
        borderBottomWidth: 1
    }
})