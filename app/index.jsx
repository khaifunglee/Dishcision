// Entry point for app, represents homepage component
import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages

// Themed components
import ThemedView from "../components/ThemedView"
import ThemedLogo from "../components/ThemedLogo"
import Spacer from "../components/Spacer"
import ThemedText from "../components/ThemedText"

const Home = () => {
    return (
        <ThemedView style={styles.container}>
            {/* Similar to CSS, <View> is like <div> */}
            <ThemedLogo />
            <Spacer height={20} />
            {/* Inline styles */}
            <ThemedText style={styles.title} title={true}>
                Home
            </ThemedText>

            <Spacer />
            <ThemedText>Welcome to Dishcision</ThemedText>
            <Spacer height={20} />

            <View style={styles.card}>
                <Text>Test Card</Text>
            </View>

            <Link href="/register" asChild style={styles.link}>
                <ThemedText>Register page</ThemedText>
            </Link>
            <Link href="/login" asChild style={styles.link}>
                <ThemedText>Login page</ThemedText>
            </Link>
        </ThemedView>

    )
}

export default Home

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
    card: {
        backgroundColor: 'papayawhip',
        padding: 18,
        borderRadius: 5,
    },
    link: {
        marginVertical: 10,
        borderBottomWidth: 1
    }
})