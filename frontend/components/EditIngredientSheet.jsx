// This component is a template for editing ingredients as a bottom modal sheet 
import { useRef, useEffect, useMemo } from "react"
import {
    View, TextInput, Pressable, StyleSheet,
    Modal, Animated, TouchableWithoutFeedback, Dimensions
} from "react-native"
import { radius, useAppColors } from "../constants/colors"

import ThemedText from "./ThemedText"

const SCREEN_HEIGHT = Dimensions.get('window').height

export default function EditIngredientSheet({ ingredient, visible, onClose, onSave, onDelete }) {
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

    const handleSave = () => {
        onClose()
        onSave()
    }
    const handleDelete = () => {
        onClose()
        onDelete()
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
                    Edit Ingredient
                </ThemedText>
                {/* Input Fields */}
                <View style={styles.fields}>
                    {/* Ingredient name input */}
                    <View style={styles.fieldGroup}>
                        <ThemedText style={styles.label}>INGREDIENT NAME</ThemedText>
                        <TextInput
                            style={[styles.input, themed.inputField]}
                            defaultValue={ingredient?.name}
                            placeholderTextColor={c.textSoft}
                        />
                    </View>
                    {/* Quantity & Unit input */}
                    <View style={styles.row}>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <ThemedText style={styles.label}>QUANTITY</ThemedText>
                            <TextInput
                                style={[styles.input, themed.inputField]}
                                defaultValue={ingredient?.qty}
                                placeholderTextColor={c.textSoft}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.fieldGroup, { flex: 1 }]}>
                            <ThemedText style={styles.label}>UNIT</ThemedText>
                            <TextInput
                                style={[styles.input, themed.inputField]}
                                defaultValue={ingredient?.unit}
                                placeholderTextColor={c.textSoft}
                            />
                        </View>
                    </View>
                    {/* Expiry Date input */}
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                        <ThemedText style={styles.label}>EXPIRY DATE</ThemedText>
                        <TextInput
                            style={[styles.input, themed.inputField]}
                            defaultValue={ingredient?.expiry}
                            placeholderTextColor={c.textSoft}
                        />
                    </View>
                    {/* Category */}
                    <View style={[styles.fieldGroup, { flex: 1 }]}>
                        <ThemedText style={styles.label}>CATEGORY</ThemedText>
                        <TextInput
                            style={[styles.input, themed.inputField]}
                            defaultValue={ingredient?.category}
                            placeholderTextColor={c.textSoft}
                        />
                    </View>
                </View>

                {/* Edit & Save button */}
                <View style={styles.btnRow}>
                    <Pressable style={({ pressed }) => [styles.btn, { backgroundColor: c.red }, pressed && styles.pressed]}
                        onPress={handleDelete}
                    >
                        <ThemedText style={styles.btnText}>Delete</ThemedText>
                    </Pressable>
                    <Pressable style={({ pressed }) => [styles.btn, { backgroundColor: c.green }, pressed && styles.pressed]}
                        onPress={handleSave}
                    >
                        <ThemedText style={styles.btnText}>Save</ThemedText>
                    </Pressable>
                </View>
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
        padding: 28, paddingBottom: 36,
        gap: 14,
    },
    handle: {
        width: 40, height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 24,
        letterSpacing: -1,
    },
    fields: { gap: 12 },
    fieldGroup: { gap: 4 },
    label: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1, borderRadius: radius.medium,
        padding: 14,
        fontSize: 14, fontFamily: 'DMSans_400Regular'
    },
    row: {
        flexDirection: 'row', gap: 12,
    },
    btnRow: {
        flexDirection: 'row', gap: 12, justifyContent: 'space-between'
    },
    btn: {
        borderRadius: radius.large, padding: 16,
        alignItems: 'center', marginTop: 4,
    },
    btnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 16, color: '#fff', },
    pressed: { opacity: 0.7 }
})