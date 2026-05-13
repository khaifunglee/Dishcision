// This component is a template for editing ingredients as a bottom modal sheet 
import { forwardRef, useCallback, useMemo } from "react"
import { View, TextInput, Pressable, StyleSheet } from "react-native"
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { radius, useAppColors } from "../constants/colors"

import ThemedText from "./ThemedText"

const EditIngredientSheet = forwardRef(({ ingredient, onSave, onDelete }, ref) => {
    const c = useAppColors()
    // Dynamic styles for theme dependent colours
    const themed = useMemo(() => ({
        inputField: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
            color: c.text,
        }
    }), [c])
    const snapPoints = useMemo(() => ['70%'], [])

    const handleSave = useCallback(() => {
        ref.current?.close()
        onSave()
    }, [])
    const handleDelete = useCallback(() => {
        ref.current?.close()
        onDelete()
    })

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: c.background }}
            handleIndicatorStyle={{ backgroundColor: c.border }}
        >
            <BottomSheetView style={styles.content}>
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
            </BottomSheetView>
        </BottomSheet>
    )
})

export default EditIngredientSheet
const styles = StyleSheet.create({
    content: { flex: 1, padding: 28, gap: 20 },
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
    btnRow: {
        flexDirection: 'row', gap: 12,
    },
    btn: {
        borderRadius: radius.large, padding: 16,
        alignItems: 'center', marginTop: 4,
    },
    btnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 16, color: '#fff', },
    pressed: { opacity: 0.7 }
})