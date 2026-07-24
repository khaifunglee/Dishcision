// This file represents the Register page component inside the route group 'auth'
import { useState, useMemo } from "react"
import { StyleSheet, View, Text, TextInput, Keyboard, Alert, TouchableWithoutFeedback, Pressable } from "react-native"
import { Link, router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useAuth } from "../../context/AuthContext"
import { radius, useAppColors } from "../../constants/colors"
// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Spacer from "../../components/Spacer"

// Maps display label to backend DietaryTag enum value
const CHIP_TO_TAG = {
    '🥦 Vegetarian': 'VEGETARIAN',
    '🌱 Vegan': 'VEGAN',
    '🐟 Pescatarian': 'PESCATARIAN',
    '🌾 Gluten-free': 'GLUTEN_FREE',
    '🥛 Dairy-free': 'DAIRY_FREE',
    '🥜 Nut-free': 'NUT_FREE',
}

const CHIPS = Object.keys(CHIP_TO_TAG)

const Register = () => {
    const { register } = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)   // loading state for register function
    const [selected, setSelected] = useState([])    // indicates selected diet tags

    const c = useAppColors()
    const themed = useMemo(() => ({
        card: { backgroundColor: c.uiBackground, borderColor: c.border },
    }), [c])

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // Register function
    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }
        if (!EMAIL_REGEX.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address')
            return
        }
        if (password.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long')
            return
        }
        setLoading(true)
        try {
            await register(name, email, password)

            // Account isn't usable until the emailed code is confirmed — carry
            // any selected dietary tags through so verify-email can apply them
            // once a valid token exists.
            const dietTags = selected.map(chip => CHIP_TO_TAG[chip]).filter(Boolean)
            router.push({
                pathname: '/verify-email',
                params: { email, dietTags: JSON.stringify(dietTags) }
            })
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed'
            Alert.alert('Error', message)
        } finally {
            setLoading(false)
        }
    }
    // Toggle chips for dietary tags
    const toggle = (chip) => {
        setSelected(prev =>
            prev.includes(chip)
                ? prev.filter(c => c !== chip) // deselect
                : [...prev, chip]              // select
        )
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container} safe>

                <View style={styles.header}>
                    <Pressable style={({ pressed }) => [styles.btnOutline, themed.card, pressed && styles.pressed]}
                        onPress={() => router.back()}>
                        <Feather name={'chevron-left'} size={22} color={c.text} />
                    </Pressable>

                    <Text style={[styles.title, { color: c.text }]}>
                        Create your account
                    </Text>
                    <Text style={[styles.tagline, { color: c.textSoft }]}>
                        Let's get your pantry ready.
                    </Text>
                </View>

                <Spacer height={30} />

                <ThemedText style={styles.subHeader} title>YOUR NAME</ThemedText>
                <TextInput
                    style={[styles.input, themed.card]}
                    placeholder="Name"
                    placeholderTextColor={c.textSoft}
                    color={c.textSoft}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />
                <ThemedText style={styles.subHeader} title>EMAIL</ThemedText>
                <TextInput
                    style={[styles.input, themed.card]}
                    placeholder="Email"
                    placeholderTextColor={c.textSoft}
                    color={c.textSoft}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <ThemedText style={styles.subHeader} title>PASSWORD</ThemedText>
                <TextInput
                    style={[styles.input, themed.card]}
                    placeholder="Min. 8 characters"
                    placeholderTextColor={c.textSoft}
                    color={c.textSoft}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Spacer height={10} />

                {/* Dietary preferences chips */}
                <ThemedText style={styles.subHeader} title>
                    DIETARY PREFERENCES <ThemedText subtitle>(optional)</ThemedText>
                </ThemedText>

                <View style={styles.chipsRow}>
                    {CHIPS.map(chip => (
                        <Pressable
                            key={chip}
                            style={[styles.chip, { backgroundColor: c.creamDark, borderColor: c.border },
                            selected.includes(chip) && { backgroundColor: c.freshLight, borderColor: c.fresh }]}
                            onPress={() => toggle(chip)}
                        >
                            <ThemedText style={[styles.chipText, selected.includes(chip) && { color: c.fresh }]} subtitle>
                                {chip}
                            </ThemedText>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.bottom}>
                    <Pressable style={({ pressed }) => [styles.btn, { backgroundColor: c.green }, pressed && styles.pressed]}
                        onPress={handleRegister} disabled={loading}>
                        <ThemedText style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold' }}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </ThemedText>
                    </Pressable>

                    <ThemedText style={{ textAlign: 'center' }}>
                        Already have an account?
                        <Link href="/login" asChild>
                            <ThemedText style={{ fontFamily: 'DMSans_600SemiBold', fontWeight: 'bold', color: c.green }}> Log in</ThemedText>
                        </Link>
                    </ThemedText>
                </View>
            </ThemedView>
        </TouchableWithoutFeedback>
    )
}
export default Register

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 36, paddingTop: 68 },
    header: { flex: 1, justifyContent: 'center', alignItems: 'left' },
    btnOutline: {
        borderWidth: 0.6, borderRadius: radius.medium,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center',
    },
    title: { fontSize: 28, fontFamily: 'Fraunces_600SemiBold',
        marginVertical: 12 },
    tagline: { fontSize: 14, fontFamily: 'DMSans_400Regular' },
    subHeader: { fontSize: 12, fontFamily: 'DMSans_600SemiBold', marginBottom: 6 },
    input: {
        borderWidth: 0.6, borderRadius: radius.medium,
        padding: 16, marginBottom: 12,
        fontSize: 14, fontFamily: 'DMSans_400Regular',
    },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        paddingBottom: 6, paddingTop: 4,
        paddingHorizontal: 14,
        borderRadius: radius.full,
        borderWidth: 1,
        alignItems: 'center', justifyContent: 'center',
    },
    chipText: { fontSize: 12 },
    bottom: { marginTop: 8 },
    btn: {
        borderRadius: radius.medium,
        padding: 16,
        marginVertical: 16,
        alignItems: 'center',
    },
    pressed: { opacity: 0.7 },
})
