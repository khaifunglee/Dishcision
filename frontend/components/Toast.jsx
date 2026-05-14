// This component is a template for toast messages after completing an action (e.g add ingredient to pantry)
import { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet } from "react-native"

import ThemedText from "./ThemedText"
import { radius, useAppColors } from "../constants/colors"

export default function Toast({ message, visible }) {
    const opacity = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(20)).current
    const [shouldRender, setShouldRender] = useState(false)

    const c = useAppColors()

    useEffect(() => {
        // Animation transition settings to display toast
        if (visible) {
            // Reset position before animating in
            setShouldRender(true)
            translateY.setValue(20)
            opacity.setValue(0)

            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1, duration: 250,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 0, duration: 250,
                    useNativeDriver: true
                }),
            ]).start()
            // Animation transition settings to fade out toast
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0, duration: 200,
                    useNativeDriver: true
                }),
                Animated.timing(translateY, {
                    toValue: 20, duration: 200,
                    useNativeDriver: true
                }),
            ]).start(() => {
                // Unmount after animation fully completes
                setShouldRender(false)
            })
        }
    }, [visible])

    // If no message then don't render toast message
    if (!shouldRender) return null

    return (
        <Animated.View style={[
            styles.toast, { backgroundColor: c.green },
            { opacity, transform: [{ translateY }] }
        ]}>
            <ThemedText style={styles.toastText}>{message}</ThemedText>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        paddingVertical: 12, paddingHorizontal: 20,
        borderRadius: radius.full,
        zIndex: 999,
    },
    toastText: { fontSize: 14, color: '#fff', }
})