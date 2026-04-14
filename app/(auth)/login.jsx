// This file represents the Login page component inside the route group 'auth'
import { StyleSheet, Text, Pressable } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages
import { Colors } from "../../constants/colors"

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedButton from "../../components/ThemedButton"
import Spacer from "../../components/Spacer"

const Login = () => {
    // Button press function
    const handleSubmit = () => {
        console.log('Login form submitted')
    }
    return (
        <ThemedView style={[styles.container]}>
            <ThemedText title={true}>Login to Your Account</ThemedText>
            <Spacer height={100} />

            <ThemedButton onPress={handleSubmit}>
                <Text style={{ color: '#f2f2f2' }}>Login</Text>
            </ThemedButton>

            <Spacer />

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