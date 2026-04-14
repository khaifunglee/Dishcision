// This file represents the Register page component inside the route group 'auth'
import { StyleSheet, Text, View, Image } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedButton from "../../components/ThemedButton"
import Spacer from "../../components/Spacer"

const Register = () => {

    const handleSubmit = () => {
        console.log('Register form submitted')
    }
    return (
        <ThemedView style={[styles.container]}>
            <ThemedText title={true}>Register an Account</ThemedText>
            <Spacer height={100} />

            <ThemedButton onPress={handleSubmit}>
                <Text style={{ color: '#f2f2f2' }}>Register</Text>
            </ThemedButton>

            <Spacer />

            <Link href="/login" asChild>
                <ThemedText style={{ textAlign: 'center' }}>Login Instead</ThemedText>
            </Link>
            <Spacer />
            <Link href="/" asChild>
                <ThemedText style={{ textAlign: 'center' }}>Back Home</ThemedText>
            </Link>
        </ThemedView>
    )
}
export default Register
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