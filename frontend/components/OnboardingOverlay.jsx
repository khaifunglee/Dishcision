// This compnent is a template for onboarding overlay messages on the main pages
import { View, Pressable, StyleSheet, Modal } from 'react-native'
import { BlurView } from 'expo-blur'
import { useAppColors } from '../constants/colors'
import { useTheme } from '../context/ThemeContext'
import ThemedText from './ThemedText'

export default function OnboardingOverlay({ visible, step, total, body, onNext, onSkip }) {
    const c = useAppColors()
    const { isDark } = useTheme()

    if (!visible) return null

    return (
        <Modal transparent animationType='fade' visible={visible}>
            <BlurView
                intensity={40}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.container}>
                <View style={[styles.tooltip, { backgroundColor: c.uiBackground, borderColor: c.border }]}>
                    {/* Header */}
                    <View style={styles.stepRow}>
                        <ThemedText style={[styles.stepLabel, { color: c.terracotta }]}>
                            STEP {step} OF {total}
                        </ThemedText>
                    </View>

                    {/* Body Text */}
                    <ThemedText style={styles.body}>{body}</ThemedText>
                    {/* Buttons */}
                    <View style={styles.footer}>
                        <Pressable onPress={onSkip}>
                            <ThemedText style={styles.skipText} subtitle>Skip tour</ThemedText>
                        </Pressable>
                        <Pressable style={({ pressed }) => [styles.nextBtn, themed.card, pressed && styles.pressed]}
                            onPress={onNext}
                        >
                            <ThemedText style={styles.nextBtnText}>
                                {step === total ? 'Get started →' : 'Next →'}
                            </ThemedText>
                        </Pressable>
                    </View>

                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', alignItems: 'center',
        padding: 32,
    },
    tooltip: {
        width: '100%',
        borderRadius: 20, borderWidth: 1,
        padding: 24, gap: 12,
    },
    stepRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    stepLabel: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 11,
        letterSpacing: 0.8,
    },
    skipText: { fontSize: 14 },
    body: {
        fontSize: 14, lineHeight: 22,
    },
    nextBtn: {
        borderRadius: 12,
        padding: 14, marginTop: 4,
        alignItems: 'center',
        marginTop: 4,
    },
    nextBtnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, }
})