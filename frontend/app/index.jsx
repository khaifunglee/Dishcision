// Entry point for app, this file represents the app's welcome screen component
import { StyleSheet, Text, View, Pressable } from "react-native"
import { router } from 'expo-router' // Expo router component to link to other pages
import { radius, palette } from "../constants/colors"

// Themed components
import ThemedView from "../components/ThemedView"
import ThemedText from "../components/ThemedText"

const WelcomeScreen = () => {
    return (
        <ThemedView style={styles.container} safe={true}>
            {/* Similar to CSS, <View> is like <div> */}
            <View style={styles.bg} />

            <View style={styles.top}>
                <View style={styles.logoMark}>
                    <ThemedText style={styles.logoEmoji}>🍽️</ThemedText>
                </View>
                <ThemedText style={styles.title} title={true} serif={true}>
                    Dish<ThemedText style={styles.titleAccent}>cision</ThemedText>
                </ThemedText>
                <ThemedText style={styles.tagline}>
                    Cook smarter, waste less. Recipes built around what you already have.
                </ThemedText>
            </View>

            <View style={styles.bottom}>
                <Pressable style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
                    onPress={() => router.push('/register')}>
                    <Text style={styles.btnPrimaryText}>Get Started</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.btnOutline, pressed && styles.pressed]}
                    onPress={() => router.push('/login')}>
                    <Text style={styles.btnOutlineText}>Log In</Text>
                </Pressable>
            </View>

        </ThemedView >
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 64,
        paddingHorizontal: 36,
    },
    bg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: palette.green,
    },
    top: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 60,
    },
    logoMark: {
        width: 72, height: 72,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    logoEmoji: { fontSize: 32 },
    title: {
        color: '#fff',
        fontSize: 52,
        marginBottom: 16,
        letterSpacing: -1,
    },
    titleAccent: {
        color: palette.terracotta,
        fontFamily: 'Fraunces_400Regular_Italic',
    },
    tagline: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 24,
        maxWidth: 280,
    },
    bottom: { gap: 24 },
    btnPrimary: {
        backgroundColor: palette.terracotta,
        borderRadius: radius.medium,
        padding: 16,
        alignItems: 'center',
    },
    btnPrimaryText: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 16,
        color: '#fff'
    },
    btnOutline: {
        borderRadius: radius.medium,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.45)',
        padding: 16,
        alignItems: 'center',
    },
    btnOutlineText: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 16,
        color: '#fff',
    },
    pressed: { opacity: 0.7 },
})