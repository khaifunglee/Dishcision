// This file represents the Verify Email page component inside the route group 'auth'
// Unverified accounts like newly registered users are redirected here
import { useState, useMemo, useEffect } from "react"
import { StyleSheet, View, Text, TextInput, Keyboard, Alert, TouchableWithoutFeedback, Pressable,
    KeyboardAvoidingView, Platform, ScrollView
 } from "react-native"
import { router, useLocalSearchParams } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useAuth } from "../../context/AuthContext"
import { useOnboarding } from "../../context/OnboardingContext"
import { updatePreferences } from "../../api/preferencesApi"
import { radius, useAppColors } from "../../constants/colors"
// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Spacer from "../../components/Spacer"

const VerifyEmail = () => {
    const { email, dietTags: dietTagsParam, sendCode: sendCodeParam } = useLocalSearchParams()
    const { verifyEmail, resendVerificationCode } = useAuth()
    const { triggerOnboarding } = useOnboarding()

    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)

    const c = useAppColors()
    const themed = useMemo(() => ({
        card: { backgroundColor: c.uiBackground, borderColor: c.border },
    }), [c])

    // Auto-fire a resend when navigated here from login's "verify now" redirect
    useEffect(() => {
        if (sendCodeParam !== '1') return

        const resendCode = async () => {
            setResending(true)
            try {
                await resendVerificationCode(email)
                Alert.alert('Code sent', 'A new code has been sent to your email.')
            } catch (error) {
                Alert.alert('Error', 'Could not resend code. Please try again shortly.')
            } finally {
                setResending(false)
            }
        }
        resendCode()
    }, [sendCodeParam, email, resendVerificationCode])

    const handleVerify = async () => {
        if (!code || code.length !== 6) {
            Alert.alert('Error', 'Enter the 6-digit code from your email')
            return
        }
        setLoading(true)
        try {
            console.log('Checking verification code: ', email)
            await verifyEmail(email, code) // _layout.jsx handles navigation on success

            // Apply any dietary preferences selected during registration
            if (dietTagsParam) {
                const dietTags = JSON.parse(dietTagsParam)
                if (dietTags.length > 0) {
                    try {
                        await updatePreferences({ dietTags })
                    } catch (e) {
                        console.warn('Failed to save initial dietary preferences:', e)
                    }
                }
            }

            await triggerOnboarding()
        } catch (error) {
            const message = error.response?.data?.message || 'Incorrect or expired code'
            Alert.alert('Verification failed', message)
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResending(true)
        try {
            await resendVerificationCode(email)
            Alert.alert('Code sent', 'A new code has been sent to your email.')
        } catch (error) {
            Alert.alert('Error', 'Could not resend code. Please try again shortly.')
        } finally {
            setResending(false)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ThemedView style={styles.container} safe>
                <KeyboardAvoidingView style={{ flex: 1 }}
                  behavior={Platform.OS === 'ios' ? 'padding': undefined}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} 
                        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

                        <View style={styles.header}>
                            <Pressable style={({ pressed }) => [styles.btnOutline, themed.card, pressed && styles.pressed]}
                                onPress={() => router.back()}>
                                <Feather name={'chevron-left'} size={22} color={c.text} />
                            </Pressable>

                            <Text style={[styles.title, { color: c.text }]}>
                                Verify your email
                            </Text>
                            <Text style={[styles.tagline, { color: c.textSoft }]}>
                                We've sent a 6-digit code to {email}.
                            </Text>
                        </View>

                        <ThemedText style={styles.subHeader} title>VERIFICATION CODE</ThemedText>
                        <TextInput
                            style={[styles.input, themed.card]}
                            placeholder="E.g: 123456"
                            placeholderTextColor={c.textSoft}
                            color={c.textSoft}
                            value={code}
                            onChangeText={setCode}
                            keyboardType="number-pad"
                            maxLength={6}
                        />

                        <View style={{ flex: 1 }} />

                        <View style={styles.bottom}>
                            <Pressable style={({ pressed }) => [styles.btn, { backgroundColor: c.green }, pressed && styles.pressed]}
                                onPress={handleVerify} disabled={loading}>
                                <ThemedText style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold' }}>
                                    {loading ? 'Verifying...' : 'Verify Email'}
                                </ThemedText>
                            </Pressable>

                            <Pressable onPress={handleResend} disabled={resending}>
                                <ThemedText style={{ textAlign: 'center', marginBottom: 16 }} subtitle>
                                    {resending ? 'Sending...' : "Didn't get a code? Resend"}
                                </ThemedText>
                            </Pressable>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </ThemedView>
        </TouchableWithoutFeedback>
    )
}
export default VerifyEmail

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 36, },
    header: { justifyContent: 'center', alignItems: 'left', 
                marginVertical: 16, gap: 12
     },
    btnOutline: {
        borderWidth: 0.6, borderRadius: radius.medium,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center',
    },
    title: {
        fontSize: 28, fontFamily: 'Fraunces_600SemiBold',
    },
    tagline: { fontSize: 14, fontFamily: 'DMSans_400Regular' },
    subHeader: { fontSize: 12, fontFamily: 'DMSans_600SemiBold', marginBottom: 6 },
    input: {
        borderWidth: 0.6, borderRadius: radius.medium,
        padding: 16, marginBottom: 12,
        fontSize: 14, fontFamily: 'DMSans_400Regular',
    },
    btn: {
        borderRadius: radius.medium,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    pressed: { opacity: 0.7 },
})
