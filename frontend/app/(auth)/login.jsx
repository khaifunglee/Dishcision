// This file represents the Login page component inside the route group 'auth'
import { useState, useMemo } from "react"
import { StyleSheet, TextInput, Alert, TouchableWithoutFeedback, Keyboard, Pressable, View } from "react-native"
import { Link, router } from 'expo-router' // Expo router component to link to other pages
import { useAuth } from "../../context/AuthContext"
import { Feather } from "@expo/vector-icons"
import { Checkbox } from '@futurejj/react-native-checkbox'
import { radius, useAppColors } from "../../constants/colors"

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Spacer from "../../components/Spacer"

const Login = () => {

    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false) // signals login function is running
    const [rememberMe, setRememberMe] = useState(false) // remember password

    const c = useAppColors()
    // Dynamic styles that depend on theme colours
    const themed = useMemo(() => ({
        card: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
        }
    }), [c])

    // Business logic for login function
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)
        try {
            console.log('1. handleLogin called')
            await login(email, password, rememberMe) // _layout.jsx handles navigation on success
            console.log('3. login succeeded')
        } catch (error) {
            console.log('error found')
            Alert.alert('Login failed', 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    // Remember password function (toggle to change rememberMe boolean value sent in token)
    const toggleCheckbox = () => {
        console.log('Auto login')
        setRememberMe(prev => !prev)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container} safe={true}>

                <View style={styles.header}>
                    <Pressable style={({ pressed }) => [styles.btnOutline, themed.card, pressed && styles.pressed]}
                        onPress={() => router.back()}>
                        <Feather name={'chevron-left'} size={22} color={c.text} />
                    </Pressable>

                    <ThemedText style={styles.title} title serif >
                        Sign In to your Account
                    </ThemedText>
                    <ThemedText style={styles.tagline} subtitle>
                        Time to cook smarter.
                    </ThemedText>
                </View>

                <Spacer height={16} />

                <ThemedText style={styles.subHeader} title>EMAIL</ThemedText>
                <TextInput
                    style={[styles.input, themed.card]}
                    color={c.textSoft}
                    placeholder="Email"
                    placeholderTextColor={c.textSoft}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <ThemedText style={styles.subHeader} title>PASSWORD</ThemedText>
                <TextInput
                    style={[styles.input, themed.card]}
                    color={c.textSoft}
                    placeholder="Password"
                    placeholderTextColor={c.textSoft}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Spacer height={8} />
                <View style={styles.inputRow}>
                    <View style={styles.rmbMe}>
                        <Checkbox
                            status={rememberMe ? 'checked' : 'unchecked'}
                            onPress={toggleCheckbox}
                            color={c.green}
                            uncheckedColor={c.green}
                        />
                        <ThemedText subtitle>Remember me</ThemedText>
                    </View>
                    <Link href="/" asChild>
                        <ThemedText style={{ textDecorationLine: 'underline', color: c.green }}>Forgot Password?</ThemedText>
                    </Link>
                </View>

                <Spacer height={216} />

                <Pressable style={({ pressed }) => [styles.btn, { backgroundColor: c.green }, pressed && styles.pressed]}
                    onPress={handleLogin} disabled={loading}>
                    <ThemedText style={{ color: '#fff' }}>{loading ? 'Logging In...' : 'Log In'}</ThemedText>
                </Pressable>

                <ThemedText style={{ textAlign: 'center' }}>
                    Don't have an account?
                    <Link href="/register" asChild>
                        <ThemedText style={{ fontFamily: 'DMSans_600SemiBold', fontWeight: 'bold', color: c.green }}> Register</ThemedText>
                    </Link>
                </ThemedText>
            </ThemedView>
        </TouchableWithoutFeedback>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 36,
        paddingTop: 56,
    },
    header: { gap: 16 },
    btnOutline: {
        borderWidth: 0.6,
        borderRadius: radius.medium,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center',
    },
    title: { fontSize: 28 },
    tagline: { fontSize: 14 },

    subHeader: {
        fontSize: 12,
        fontFamily: 'DMSans_600SemiBold',
        marginBottom: 6
    },
    input: {
        borderWidth: 0.6,
        borderRadius: radius.medium,
        padding: 16,
        marginBottom: 12,
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    rmbMe: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8,
    },
    btn: {
        borderRadius: radius.medium,
        padding: 16,
        marginVertical: 16,
        alignItems: 'center',
    },
    pressed: { opacity: 0.7 },
})