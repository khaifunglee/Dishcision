// This compnent is a template for onboarding overlay messages on the main pages
import { View, Pressable, StyleSheet, Modal } from 'react-native'
import { BlurView } from 'expo-blur'
import { radius, useAppColors } from '../constants/colors'
import { useTheme } from '../context/ThemeContext'
import ThemedText from './ThemedText'
import { useMemo } from 'react'

export default function OnboardingOverlay({ visible, step, total, body, onNext, onSkip }) {
    const c = useAppColors()
    const { isDark } = useTheme()

    if (!visible) return null

    return (
        <Modal transparent animationType='fade' visible={visible}>
            <BlurView
                intensity={10}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.container}>
                <View style={[styles.tooltip, { backgroundColor: c.uiBackground, borderColor: c.border }]}>
                    {/* Header */}
                    <View style={styles.stepRow}>
                        <ThemedText style={[styles.stepLabel, { color: c.green }]}>
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
                        <Pressable style={({ pressed }) => [styles.nextBtn, { backgroundColor: c.green, borderColor: c.green }, pressed && styles.pressed]}
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
        position: 'absolute', bottom: 100,
        flex: 1,
        alignItems: 'left',
        padding: 24,
    },
    tooltip: {
        width: '90%',
        borderRadius: 20,
        padding: 22, gap: 8,
    },
    stepLabel: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 12,
        letterSpacing: 0.8,
    },
    skipText: { fontSize: 14 },
    body: {
        fontSize: 12, lineHeight: 22,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextBtn: {
        borderRadius: radius.medium, borderWidth: 1,
        paddingVertical: 10, paddingHorizontal: 16,
        alignItems: 'center',
        marginTop: 4,
    },
    nextBtnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: '#fff' }
})