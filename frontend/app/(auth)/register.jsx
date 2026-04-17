// This file represents the Register page component inside the route group 'auth'
import { useState } from "react"
import { StyleSheet, Text, TextInput, Pressable, Alert } from "react-native"
import { Link } from 'expo-router' // Expo router component to link to other pages
import { useAuth } from "../../context/AuthContext"

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedButton from "../../components/ThemedButton"
import Spacer from "../../components/Spacer"

const Register = () => {

    const { register } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false) // signals register function is rnning

    // Business logic for register function
    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long')
            return
        }
        setLoading(true)
        try {
            await register(name, email, password) // _layout.jsx handles navigation on success
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed'
            Alert.alert('Error', message)
        } finally {
            setLoading(false)
        }
    }
    return (
        <ThemedView style={[styles.container]}>
            <ThemedText title={true}>Register an Account</ThemedText>
            <Spacer height={100} />

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
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

            <ThemedButton onPress={handleRegister} disabled={loading}>
                <Text style={{ color: '#f2f2f2' }}>{loading ? 'Creating account...' : 'Register'}</Text>
            </ThemedButton>

            <Spacer />

            <Link href="/login" asChild>
                <ThemedText style={{ textAlign: 'center' }}>Login Instead</ThemedText>
            </Link>
            <Spacer />
            <Link href="/" asChild>
                <ThemedText style={{ textAlign: 'center' }}>Back to Index Page</ThemedText>
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