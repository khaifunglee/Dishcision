// Bottom sheet modal for "I cooked this" — confirm servings size
import { useRef, useEffect, useState, useMemo } from "react"
import {
    View, Pressable, StyleSheet, Modal,
    Animated, TouchableWithoutFeedback, Dimensions, ActivityIndicator
} from "react-native"
import { radius, useAppColors } from "../constants/colors"
import { cookRecipe } from "../api/historyApi"
import ThemedText from "./ThemedText"

const SCREEN_HEIGHT = Dimensions.get('window').height

export default function CookSheet({ visible, onClose, recipe, onCookSuccess }) {
    const c = useAppColors()
    const [servings, setServings] = useState(1)
    const [loading, setLoading] = useState(false)

    // Reset to recipe servings default (2) whenever sheet opens
    useEffect(() => {
        if (visible && recipe?.servings) {
            setServings(recipe.servings)
        }
    }, [visible, recipe])
    // Function to confirm cook recipe
    const handleConfirm = async () => {
        setLoading(true)
        try {
            console.log('Calling cook recipe API...')
            const result = await cookRecipe(recipe.id, servings)
            onClose()
            onCookSuccess(result)
        } catch (e) {
            console.error('Cook error:', e)
            onClose()
            onCookSuccess(null) // null signals error to parent
        } finally {
            setLoading(false)
        }
    }

    const themed = useMemo(() => ({
        counter: { backgroundColor: c.uiBackground, borderColor: c.border },
    }), [c])
    // Slide animation for bottom odal
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 4 }).start()
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true
            }).start()
        }
    }, [visible])

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.sheet, {
                backgroundColor: c.background, transform: [{ translateY: slideAnim }]
            }]}>
                <View style={[styles.handle, { backgroundColor: c.border }]} />

                <ThemedText style={styles.title} serif>I Cooked This</ThemedText>
                <ThemedText style={styles.subtitle} subtitle>
                    How many servings did you make?
                </ThemedText>

                {/* Servings stepper */}
                <View style={styles.stepperRow}>
                    <Pressable
                        style={({ pressed }) => [styles.stepBtn, { backgroundColor: c.uiBackground, borderColor: c.border }, pressed && styles.pressed]}
                        onPress={() => setServings(s => Math.max(1, s - 1))}>
                        <ThemedText style={styles.stepBtnText}>−</ThemedText>
                    </Pressable>

                    <View style={[styles.counter, themed.counter]}>
                        <ThemedText style={styles.counterText} serif>
                            {servings}
                        </ThemedText>
                        <ThemedText style={styles.counterLabel} subtitle>
                            serving{servings === 1 ? '' : 's'}
                        </ThemedText>
                    </View>

                    <Pressable
                        style={({ pressed }) => [styles.stepBtn, { backgroundColor: c.uiBackground, borderColor: c.border }, pressed && styles.pressed]}
                        onPress={() => setServings(s => Math.min(12, s + 1))}>
                        <ThemedText style={styles.stepBtnText}>+</ThemedText>
                    </Pressable>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.confirmBtn,
                        { backgroundColor: c.green },
                        pressed && styles.pressed,
                        loading && styles.disabled,
                    ]}
                    onPress={handleConfirm}
                    disabled={loading}>
                    {loading
                        ? <ActivityIndicator color='#fff' />
                        : <ThemedText style={styles.confirmBtnText}>Confirm</ThemedText>
                    }
                </Pressable>
            </Animated.View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    sheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 28, paddingBottom: 40, gap: 16,
    },
    handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
    title: { fontSize: 24, letterSpacing: -1 },
    subtitle: { fontSize: 14, marginTop: -8 },

    stepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginVertical: 6 },
    stepBtn: {
        width: 48, height: 48,
        borderRadius: radius.small, borderWidth: 1.5,
        alignItems: 'center', justifyContent: 'center',
    },
    stepBtnText: { fontSize: 22, fontFamily: 'DMSans_400Regular' },
    counter: {
        width: 100, height: 72,
        borderRadius: radius.small, borderWidth: 1.5,
        alignItems: 'center', justifyContent: 'center',
    },
    counterText: { fontSize: 24, lineHeight: 30 },
    counterLabel: { fontSize: 12, },

    confirmBtn: {
        borderRadius: radius.large, padding: 16,
        alignItems: 'center', marginTop: 4,
    },
    confirmBtnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 16, color: '#fff' },
    disabled: { opacity: 0.6 },
    pressed: { opacity: 0.7 },
})
