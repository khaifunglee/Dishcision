// This file represents the Login page component inside the route group 'auth'
import { useState } from "react"
import { StyleSheet, Text, TextInput, Pressable, Alert } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages
import { Colors } from "../../constants/colors"
import { useAuth } from "../../context/AuthContext"

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedButton from "../../components/ThemedButton"
import Spacer from "../../components/Spacer"

const Login = () => {

    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false) // prevent duplicate running of login function

    // Business logic for login function
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)
        try {
            await login(email, password)
        } catch (error) {
            Alert.alert('Login failed', 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    // Button press function
    const handleSubmit = () => {
        console.log('Login form submitted')
    }
    return (
        <ThemedView style={[styles.container]}>
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
            <Spacer height={15} />
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