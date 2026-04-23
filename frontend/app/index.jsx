// Entry point for app, this file represents the app's welcome screen component
import { StyleSheet, Text, View, Pressable } from "react-native"
import { Link, router } from 'expo-router' // Expo router component to link to other pages
import { Colors, radius } from "../constants/colors"

// Themed components
import ThemedView from "../components/ThemedView"
import ThemedLogo from "../components/ThemedLogo"
import Spacer from "../components/Spacer"
import ThemedText from "../components/ThemedText"
import ThemedButton from "../components/ThemedButton"

const WelcomeScreen = () => {
    return (
        <View style={styles.container} >
            {/* Similar to CSS, <View> is like <div> */}
            <View style={styles.bg} />
            <View style={styles.content} />

            <View style={styles.top}>
                <View style={styles.logoMark}>
                    <Text style={styles.logoEmoji}>🍽️</Text>
                </View>
                <Text style={styles.title}>
                    Dish<Text style={styles.titleAccent}>cision</Text>
                </Text>
                <Text style={styles.tagline}>
                    Cook smarter, waste less. Recipes built around what you already have.
                </Text>
            </View>

            <View style={styles.bottom}>
                <Pressable style={styles.btnPrimary} onPress={() => router.push('/register')}>
                    <Text style={styles.btnPrimaryText}>Get Started</Text>
                </Pressable>
                <Pressable style={styles.btnOutline} onPress={() => router.push('/login')}>
                    <Text style={styles.btnOutlineText}>Log In</Text>
                </Pressable>
            </View>

        </View >
    )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#243D1A',
        flex: 1,
        paddingTop: 56,
        paddingBottom: 56,
        paddingLeft: 24,
        paddingRight: 24,
    },
    bg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#243D1A',
    },
    content: {
        flex: 1,
        paddingHorizontal: 36,
        paddingTop: 100,
        paddingBottom: 60,
        justifyContent: 'space-between'
    },
    top: {
        flex: 1,
        justifyContent: 'center',
        marginBottom: 100,
    },
    logoMark: {
        width: 72, height: 72,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    logoEmoji: { fontSize: 32 },
    title: {
        fontWeight: 'Fraunces_600SemiBold',
        fontSize: 52,
        color: '#fff',
        letterSpacing: -1,
        marginBottom: 16,
    },
    titleAccent: {
        color: '#C05C2A',
        fontFamily: 'Fraunces_400Regular_Italic',
    },
    tagline: {
        fontFamily: 'DMSans_400Regular',
        fontSize: 16,
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 24,
        maxWidth: 280,
    },
    bottom: { gap: 12 },
    btnPrimary: {
        backgroundColor: '#C05C2A',
        borderRadius: radius.md,
        padding: 17,
        alignItems: 'center',
    },
    btnPrimaryText: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 16,
        color: '#fff'
    },
    btnOutline: {
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
        padding: 16,
        alignItems: 'center',
    },
    btnOutlineText: {
        fontFamily: 'DMSans_500Medium',
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
    }
})