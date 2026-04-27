// This file represents the Login page component inside the route group 'auth'
import { useState } from "react"
import { StyleSheet, Text, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages
import { useAuth } from "../../context/AuthContext"

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Spacer from "../../components/Spacer"
import ThemedButton from "../../components/ThemedButton"

const Login = () => {

    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false) // signals login function is running

    // Business logic for login function
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)
        try {
            await login(email, password) // _layout.jsx handles navigation on success
        } catch (error) {
            Alert.alert('Login failed', 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container} safe={true}>
                <ThemedText style={styles.title} title={true}>Login to Your Account</ThemedText>
                <Spacer height={100} />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Spacer />
                <ThemedButton onPress={handleLogin} disabled={loading}>
                    <Text style={{ color: '#f2f2f2' }}>{loading ? 'Logging in...' : 'Login'}</Text>
                </ThemedButton>
                <Spacer />
                <Link href="/register" asChild>
                    <ThemedText style={{ textAlign: 'center' }}>Don't have an account? Register</ThemedText>
                </Link>
            </ThemedView>
        </TouchableWithoutFeedback>
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
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
        marginBottom: 16,
        fontSize: 16,
        width: 240
    }
})