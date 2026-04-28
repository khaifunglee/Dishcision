// This file represents the Login page component inside the route group 'auth'
import { useState } from "react"
import { StyleSheet, Text, TextInput, Alert, TouchableWithoutFeedback, Keyboard, Pressable, View } from "react-native"
import { Link, router } from 'expo-router' // Expo router component to link to other pages
import { useAuth } from "../../context/AuthContext"
import { Feather } from "@expo/vector-icons"
import { Checkbox } from '@futurejj/react-native-checkbox'
import { palette, radius } from "../../constants/colors"

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
    const [checked, setChecked] = useState(false) // remember password

    // Business logic for login function
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        setLoading(true)
        try {
            //console.log('1. handleLogin called')
            await login(email, password) // _layout.jsx handles navigation on success
            //console.log('3. login succeeded')
        } catch (error) {
            //console.log('error found')
            Alert.alert('Login failed', 'Invalid email or password')
        } finally {
            setLoading(false)
        }
    }

    // Remember password function (placeholder for now)
    const toggleCheckbox = () => {
        setChecked(!checked)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container} safe={true}>

                <View style={styles.header}>
                    <Pressable style={({ pressed }) => [styles.btnOutline, pressed && styles.pressed]}
                        onPress={() => router.push('/')}>
                        <Feather name={'chevron-left'} size={22} color={'black'} />
                    </Pressable>

                    <ThemedText style={styles.title} title serif >
                        Sign In to your Account
                    </ThemedText>
                    <ThemedText style={styles.tagline}>
                        Time to cook smarter.
                    </ThemedText>
                </View>

                <Spacer height={16} />

                <ThemedText style={styles.subHeader} title>EMAIL</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <ThemedText style={styles.subHeader} title>PASSWORD</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <Spacer height={8} />
                <View style={styles.inputRow}>
                    <View style={styles.rmbMe}>
                        <Checkbox
                            status={checked ? 'checked' : 'unchecked'}
                            onPress={toggleCheckbox}
                            color={palette.green}
                            uncheckedColor={palette.green}
                        />
                        <ThemedText>Remember me</ThemedText>
                    </View>
                    <Link href="/" asChild>
                        <ThemedText style={{ textDecorationLine: 'underline', color: palette.green }}>Forgot Password?</ThemedText>
                    </Link>
                </View>

                <Spacer height={216} />

                <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
                    onPress={handleLogin} disabled={loading}>
                    <ThemedText style={{ color: '#fff' }}>{loading ? 'Logging In...' : 'Log In'}</ThemedText>
                </Pressable>

                <ThemedText style={{ textAlign: 'center' }}>
                    Don't have an account?
                    <Link href="/register" asChild>
                        <ThemedText style={{ fontFamily: 'DMSans_600SemiBold', fontWeight: 'bold', color: palette.green }}> Register</ThemedText>
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
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    header: {
        gap: 16,
        //flex: 1,
        //justifyContent: 'space-around',
        //alignItems: 'left',
    },
    btnOutline: {
        borderWidth: 0.6,
        borderColor: '#ccc',
        borderRadius: radius.medium,
        //padding: 10,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center',
    },
    title: {
        fontSize: 28,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.65)',
    },
    subHeader: {
        fontSize: 12,
        fontFamily: 'DMSans_600SemiBold',
        marginBottom: 6
    },
    input: {
        borderWidth: 0.6,
        borderColor: '#ccc',
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
        backgroundColor: palette.green,
        borderRadius: radius.medium,
        padding: 16,
        marginVertical: 16,
        alignItems: 'center',
    },
    pressed: { opacity: 0.7 },
})