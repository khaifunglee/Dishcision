// This file represents the Login page component inside the route group 'auth'
import { StyleSheet, Text, View, Image } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Spacer from "../../components/Spacer"

const Login = () => {

    return (
        <ThemedView style={[styles.container]}>
            <ThemedText title={true}>Login to Your Account</ThemedText>
            <Spacer height={100} />

            <Link href="/register" asChild>
                <ThemedText style={{ textAlign: 'center' }}>Register instead?</ThemedText>
            </Link>
        </ThemedView>
    )
}

export default Login
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
})