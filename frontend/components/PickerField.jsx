// This component is a template for input fields requiring dropdown fields using a Picker inline scroll wheel
import React, { useState } from "react"
import { View, Pressable, StyleSheet } from "react-native"
import { Picker } from "@react-native-picker/picker"

import ThemedText from "./ThemedText"
import { radius, useAppColors } from "../constants/colors"

export default function PickerField({ label, selectedValue, onValueChange, options }) {
    const c = useAppColors()
    const [open, setOpen] = useState(false)

    return (
        <View style={styles.fieldGroup}>
            {/* {label && <ThemedText style={styles.fieldLabel}>{label}</ThemedText>} */}

            {/* Tappable input field (Picker only displays when input field is tapped) */}
            <Pressable
                style={[styles.inputField, { backgroundColor: c.uiBackground }]}
                onPress={() => setOpen(prev => !prev)}
                activeOpacity={0.7}
            >
                <ThemedText style={styles.displayValue} subtitle>{selectedValue}</ThemedText>
                <ThemedText style={styles.chevron} subtitle>{open ? '▲' : '▼'}</ThemedText>
            </Pressable>

            {/* Inline wheel (only mounted when open) */}
            {open && (
                <View style={[styles.pickerContainer, { backgroundColor: c.uiBackground, borderColor: c.border }]}>
                    <Picker
                        selectedValue={selectedValue}
                        onValueChange={(val) => {
                            onValueChange(val)
                        }}
                        style={[styles.picker,]}>
                        {options.map(opt => (
                            <Picker.Item color={c.text} fontFamily={'DMSans_400Regular'} key={opt} label={opt} value={opt} />
                        ))}
                    </Picker>
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    fieldGroup: { marginBottom: 16 },
    fieldLabel: {
        fontSize: 12, letterSpacing: 1, marginBottom: 6,
    },
    inputField: {
        paddingTop: 14, marginBottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    displayValue: { fontSize: 14 },
    chevron: { fontSize: 10, },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: radius.medium, marginTop: 6,
        overflow: 'hidden',
    },
    picker: {
        justifyContent: 'center',
        height: 140
    },
});