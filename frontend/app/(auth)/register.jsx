// This file represents the Register page component inside the route group 'auth'
import { useState } from "react"
import { StyleSheet, View, Text, TextInput, Keyboard, Alert, TouchableWithoutFeedback, Pressable } from "react-native"
import { Link, router } from 'expo-router' // Expo router component to link to other pages
import { Feather } from '@expo/vector-icons'
import { useAuth } from "../../context/AuthContext"
import { palette, radius } from "../../constants/colors"

// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Spacer from "../../components/Spacer"

const Register = () => {

    const { register } = useAuth()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false) // signals register function is rnning
    const [selected, setSelected] = useState([]) // chips

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

    // Toggle chips for dietary preferences
    const toggle = (chip) => {
        setSelected(prev =>
            prev.includes(chip)
                ? prev.filter(c => c !== chip) // remove if already selected
                : [...prev, chip]              // add if not selected
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container} safe>

                <View style={styles.header}>
                    <Pressable style={styles.btnOutline} onPress={() => router.push('/')}>
                        <Feather name={'chevron-left'} size={22} color={'black'} />
                    </Pressable>

                    <ThemedText style={styles.title} title={true} serif={true}>
                        Create your account
                    </ThemedText>
                    <ThemedText style={styles.tagline}>
                        Let's get your pantry ready.
                    </ThemedText>
                </View>

                <Spacer height={30} />

                <ThemedText style={styles.subHeader} title>YOUR NAME</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
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
                    placeholder="Min. 8 characters"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Spacer height={10} />

                {/* Dietary preferences chips */}
                <ThemedText style={styles.subHeader} title>
                    DIETARY PREFERENCES <ThemedText style={styles.subHeaderAccent}>(optional)</ThemedText>
                </ThemedText>

                <View style={styles.chipsRow}>
                    {[
                        '🥦 Vegetarian', '🌱 Vegan', '🐟 Pescatarian', '🌾 Gluten-free', '🥛 Dairy-free', '🥜 Nut-free'
                    ].map(chip => (
                        <Pressable
                            key={chip}
                            style={[styles.chip, selected.includes(chip) && styles.chipActive]}
                            onPress={() => toggle(chip)}
                        >
                            <ThemedText style={[styles.chipText, selected.includes(chip) && styles.chipTextActive]}>
                                {chip}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.bottom}>
                    <Pressable style={styles.btn} onPress={handleRegister} disabled={loading}>
                        <ThemedText style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold' }}>{loading ? 'Creating account...' : 'Create Account'}</ThemedText>
                    </Pressable>

                    <ThemedText style={{ textAlign: 'center' }}>
                        Already have an account?
                        <Link href="/login" asChild>
                            <ThemedText style={{ fontFamily: 'DMSans_600SemiBold', fontWeight: 'bold', color: palette.green }}> Log in</ThemedText>
                        </Link>
                    </ThemedText>
                </View>
            </ThemedView>
        </TouchableWithoutFeedback>
    )
}
export default Register
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 36,
        paddingTop: 68,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left',
    },
    btnOutline: {
        borderWidth: 0.6,
        borderColor: '#ccc',
        borderRadius: radius.medium,
        padding: 10,
        height: 44,
        width: 44,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        marginVertical: 12,
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
    subHeaderAccent: {
        color: 'rgba(0,0,0,0.45)',
    },
    chipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.45)',
        backgroundColor: 'white',
    },
    chipActive: {
        backgroundColor: palette.greenLight,
        borderColor: palette.green,
    },
    chipText: {
        fontSize: 12,
        color: palette.warmGray,
    },
    chipTextActive: {
        color: palette.green,
    },
    bottom: {
        marginTop: 8,
    },
    btn: {
        backgroundColor: palette.green,
        borderRadius: radius.medium,
        padding: 16,
        marginVertical: 16,
        alignItems: 'center',
    },
})