// This component is a template for adding ingredients as a bottom modal sheet 
import { useRef, useEffect, useMemo } from "react"
import {
    View, TextInput, Pressable, StyleSheet,
    Modal, Animated, TouchableWithoutFeedback, Dimensions
} from "react-native"
import { radius, useAppColors } from "../constants/colors"

import ThemedText from "./ThemedText"

const SCREEN_HEIGHT = Dimensions.get('window').height

export default function AddIngredientSheet({ visible, onClose, onAdd }) {
    const c = useAppColors()
    // Dynamic styles for theme dependent colours
    const themed = useMemo(() => ({
        inputField: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
            color: c.text,
        }
    }), [c])

    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
    // Hook for displaying on and off bottom modal animation
    useEffect(() => {
        // Display animation
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 4,
            }).start()
            // Remove animation
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }).start()
        }
    }, [visible])

    const handleAdd = () => {
        onClose()
        onAdd()
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* Dim background */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            {/* Sheet */}
            <Animated.View style={[styles.sheet, {
                backgroundColor: c.background, transform: [{ translateY: slideAnim }]
            }]}>
                {/* Handle */}
                <View style={[styles.handle, { backgroundColor: c.border }]} />
                <ThemedText style={styles.title} serif>
                    Add Ingredient
                </ThemedText>

                {/* Input Fields */}
                <View style={styles.fields}>
                    {/* Ingredient name input */}
                    <View style={styles.fieldGroup}>
                        <ThemedText style={styles.label}>INGREDIENT NAME</ThemedText>
                        <TextInput
                            style={[styles.input, themed.inputField]}
                            placeholder="e.g: Cherry Tomatoes"
                            placeholderTextColor={c.textSoft}
                        />
                    </View>
                    {/* Quantity & Unit input */}
                    <View style={styles.row}>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <ThemedText style={styles.label}>QUANTITY</ThemedText>
                            <TextInput
                                style={[styles.input, themed.inputField]}
                                placeholder="e.g: 200"
                                placeholderTextColor={c.textSoft}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <ThemedText style={styles.label}>UNIT</ThemedText>
                            <TextInput
                                style={[styles.input, themed.inputField]}
                                placeholder="g, ml, pieces"
                                placeholderTextColor={c.textSoft}
                            />
                        </View>
                    </View>
                    {/* Expiry Date input */}
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                        <ThemedText style={styles.label}>EXPIRY DATE</ThemedText>
                        <TextInput
                            style={[styles.input, themed.inputField]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={c.textSoft}
                        />
                    </View>
                    {/* Category */}
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                        <ThemedText style={styles.label}>CATEGORY</ThemedText>
                        <TextInput
                            style={[styles.input, themed.inputField]}
                            placeholder="Protein, Dairy, Vegetables"
                            placeholderTextColor={c.textSoft}
                        />
                    </View>
                </View>

                <Pressable style={({ pressed }) => [styles.addBtn, { backgroundColor: c.green }, pressed && styles.pressed]}
                    onPress={handleAdd}
                >
                    <ThemedText style={styles.addBtnText}>Add to Pantry</ThemedText>
                </Pressable>
            </Animated.View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 28, paddingBottom: 28,
        gap: 20,
    },
    handle: {
        width: 40, height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        letterSpacing: -0.5,
    },
    fields: { gap: 16 },
    fieldGroup: { gap: 6 },
    label: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 12,
        letterSpacing: 0.8,
    },
    input: {
        borderWidth: 1, borderRadius: radius.medium,
        padding: 14,
        fontSize: 14,
    },
    row: {
        flexDirection: 'row', gap: 12,
    },
    addBtn: {
        borderRadius: radius.large, padding: 16,
        alignItems: 'center', marginTop: 4,
    },
    addBtnText: { fontSize: 16, color: '#fff', },
    pressed: { opacity: 0.7 }
})