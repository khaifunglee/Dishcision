// This component is a template for adding/editing ingredients as a bottom modal sheet 
import { useRef, useEffect, useMemo, useState } from "react"
import {
    View, TextInput, Pressable, StyleSheet, Keyboard,
    Modal, Animated, TouchableWithoutFeedback, Dimensions,
    ActivityIndicator, Platform, ScrollView
} from "react-native"
import DateTimePicker from '@react-native-community/datetimepicker'
import { radius, useAppColors } from "../constants/colors"

import ThemedText from "./ThemedText"
import PickerField from "./PickerField.jsx"

import { searchIngredients, addItem, updateItem } from '../api/pantryApi.js'

const SCREEN_HEIGHT = Dimensions.get('window').height

const UNIT_OPTIONS = {
    WEIGHT: ['kg', 'g', 'oz', 'lb'],
    VOLUME: ['ml', 'l', 'cups', 'tbsp', 'tsp'],
    COUNT: ['pieces', 'cloves', 'heads', 'bunches', 'cans', 'jars'],
}
const DEFAULT_UNITS = { WEIGHT: 'g', VOLUME: 'ml', COUNT: 'pieces' }
const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Pantry Staple', 'Frozen', 'Other']

export default function AddIngredientSheet({ visible, onClose, onSaved, editingItem }) {

    // States for adding ingredients
    const isEditing = !!editingItem
    const [ingredientName, setIngredientName] = useState('')
    const [quantity, setQuantity] = useState('')
    const [unit, setUnit] = useState('g')
    const [expiryDate, setExpiryDate] = useState(null)
    const [category, setCategory] = useState('Dairy')
    const [showDatePicker, setShowDatePicker] = useState(false)
    // Autofill states
    const [suggestions, setSuggestions] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [resolvedUnitType, setResolvedUnitType] = useState(null)

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // Pre-fill when adding
    useEffect(() => {
        console.log('editingItem received: ', JSON.stringify(editingItem))
        if (editingItem) {
            setIngredientName(editingItem.ingredientName || '');
            setQuantity(editingItem.quantity?.toString() || '');
            setUnit(editingItem.unit || 'g');
            setExpiryDate(editingItem.expiryDate ? new Date(editingItem.expiryDate) : null);
            setCategory(editingItem.category || 'Dairy');
            setResolvedUnitType(editingItem.unitType || null);
        } else {
            resetForm();
        }
    }, [editingItem, visible]);

    // Default form field
    const resetForm = () => {
        setIngredientName('')
        setQuantity('')
        setUnit('g')
        setExpiryDate(null)
        setCategory('Dairy')
        setSuggestions([])
        setResolvedUnitType(null)
        setError('')
    }

    // Load ingredient names for autofill search function — debounced at 300ms
    useEffect(() => {
        if (ingredientName.length < 3) {
            setSuggestions([])
            return
        }
        const timer = setTimeout(async () => {
            setSearchLoading(true);
            try {
                console.log('Searching for: ', ingredientName)
                const results = await searchIngredients(ingredientName);
                console.log('Results: ', results)
                setSuggestions(results);
            } catch (e) {
                setSuggestions([]);
                console.error('Search error: ', e)
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [ingredientName]);

    // Autofill function for choosing suggested ingredient name
    const selectSuggestion = (suggestion) => {
        setIngredientName(suggestion.canonicalName)
        setCategory(suggestion.category || category)
        setSuggestions([])

        // Auto-select unit based on unit type
        if (suggestion.unitType) {
            setResolvedUnitType(suggestion.unitType)
            const defaultUnit = suggestion.defaultUnit || DEFAULT_UNITS[suggestion.unitType]
            setUnit(defaultUnit)
        }
    }

    // Function for saving updated ingredient item
    const handleSave = async () => {

        if (!ingredientName.trim()) {
            setError('Ingredient name is required.')
            return
        }
        if (!quantity || isNaN(parseFloat(quantity))) {
            setError('Enter a valid quantity.')
            return
        }
        console.log('Updating/adding item: ', ingredientName)
        setSaving(true)
        setError('')

        const payload = {
            ingredientName: ingredientName.trim(),
            quantity: parseFloat(quantity),
            unit,
            expiryDate: expiryDate ? expiryDate.toISOString().split('T')[0] : null,
            category
        }
        console.log('Sending payload to POST API: ', payload)

        // Send POST API
        try {
            let saved
            if (isEditing) {
                saved = await updateItem(editingItem.id, payload)
                console.log(`Updated ingredient ${editingItem.ingredientName}: `, saved)
            } else {
                saved = await addItem(payload)
                console.log('Added ingredient: ', saved)
            }
            onSaved(saved, isEditing)
            resetForm()
            onClose()
        } catch (e) {
            setError('Something went wrong. Please try again')
            console.log('Add/update item error: ', e)
        } finally {
            setSaving(false)
        }
    }

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
    // Choose any unit in picker
    const currentUnits = [...UNIT_OPTIONS.WEIGHT, ...UNIT_OPTIONS.VOLUME, ...UNIT_OPTIONS.COUNT]

    // Format date
    const formatDate = (date) => {
        if (!date) return 'Select Date'
        return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
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
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    {/* Handle */}
                    <View style={[styles.handle, { backgroundColor: c.border }]} />
                    <ThemedText style={styles.title} serif>
                        {isEditing ? 'Edit Ingredient' : 'Add Ingredient'}
                    </ThemedText>

                    {/* Input Fields */}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.fields}>
                            {/* Ingredient name input */}
                            <View style={styles.fieldGroup}>
                                <ThemedText style={styles.label}>INGREDIENT NAME</ThemedText>
                                <TextInput
                                    style={[styles.input, themed.inputField]}
                                    value={ingredientName}
                                    onChangeText={setIngredientName}
                                    placeholder="e.g: Cherry Tomatoes"
                                    placeholderTextColor={c.textSoft}
                                    autoCorrect={false}
                                />
                                {/* Autofill suggestion list */}
                                {searchLoading && <ActivityIndicator size='small' color={c.green} style={{ marginTop: 4 }} />}
                                {/* Only load suggestions if >2 letters typed */}
                                {suggestions.length > 0 && (
                                    <View style={[styles.suggestionsBox, themed.inputField]}>
                                        {suggestions.map((s) => (
                                            <Pressable
                                                key={s.id}
                                                style={({ pressed }) => [styles.suggestionItem, { borderBottomColor: c.border }, pressed && styles.pressed]}
                                                onPress={() => selectSuggestion(s)}
                                            >
                                                <ThemedText style={styles.suggestionName}>{s.canonicalName}</ThemedText>
                                                <ThemedText style={styles.suggestionMeta} subtitle>{s.category} | {s.defaultUnit || s.unitType}</ThemedText>
                                            </Pressable>
                                        ))}
                                    </View>
                                )}
                            </View>
                            {/* Quantity & Unit input */}
                            <View style={styles.row}>
                                <View style={[styles.fieldGroup, { flex: 1 }]}>
                                    <ThemedText style={styles.label}>QUANTITY</ThemedText>
                                    <TextInput
                                        style={[styles.input, themed.inputField]}
                                        value={quantity}
                                        onChangeText={setQuantity}
                                        placeholder="e.g: 200"
                                        placeholderTextColor={c.textSoft}
                                        keyboardType="decimal-pad"
                                    />
                                </View>
                                <View style={[styles.fieldGroup, { flex: 1 }]}>
                                    <ThemedText style={styles.label}>UNIT</ThemedText>
                                    <View style={[styles.input, themed.inputField, styles.pickerWrapper]}>
                                        {/* Dropdown list */}
                                        <PickerField
                                            label="UNIT"
                                            selectedValue={unit}
                                            onValueChange={setUnit}
                                            options={currentUnits}
                                        />
                                    </View>
                                </View>
                            </View>

                            {/* Category */}
                            <View style={[styles.fieldGroup, { flex: 1 }]}>
                                <ThemedText style={styles.label}>CATEGORY</ThemedText>
                                <View style={[styles.input, themed.inputField, styles.pickerWrapper]}>
                                    <PickerField
                                        label="CATEGORY"
                                        selectedValue={category}
                                        onValueChange={setCategory}
                                        options={CATEGORIES}
                                    />
                                </View>
                            </View>

                            {/* Expiry Date input */}
                            <View style={[styles.fieldGroup, { flex: 1 }]}>
                                <ThemedText style={styles.label}>EXPIRY DATE (OPTIONAL)</ThemedText>
                                <View style={[styles.input, themed.inputField]}>
                                    <Pressable
                                        onPress={() => setShowDatePicker(prev => !prev)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <ThemedText style={expiryDate ? [styles.dateText, { color: c.text }] : [styles.datePlaceholder, { color: c.textSoft }]}>
                                                {formatDate(expiryDate)}
                                            </ThemedText>
                                            {expiryDate ? <Pressable onPress={() => { setExpiryDate(null); setShowDatePicker(false) }}>
                                                <ThemedText style={{ fontSize: 12, }} subtitle>Clear Date</ThemedText>
                                            </Pressable> : <ThemedText style={{ fontSize: 12, }}>🗓️</ThemedText>}
                                        </View>
                                    </Pressable>
                                </View>

                            </View>

                            {showDatePicker && (
                                <View style={[styles.calendarWrapper, themed.inputField]}>
                                    <DateTimePicker
                                        value={expiryDate || null}
                                        mode='date'
                                        display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                        minimumDate={null}
                                        themeVariant='light'
                                        accentColor={c.green}
                                        onChange={(event, date) => {
                                            if (Platform.OS === 'android') setShowDatePicker(false)
                                            if (date) setExpiryDate(date); setShowDatePicker(false)
                                        }}
                                        textColor={c.text}
                                        style={{ width: '100%', }}
                                    />
                                </View>
                            )}

                            {error ? <ThemedText style={[styles.errorText, { color: c.red }]}>{error}</ThemedText> : null}

                        </View>
                    </TouchableWithoutFeedback>

                    <Pressable style={({ pressed }) => [styles.btn, { backgroundColor: c.green }, pressed && styles.pressed, saving && styles.btnDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving
                            ? <ActivityIndicator color='#fff' />
                            : <ThemedText style={styles.btnText}>{isEditing ? 'Save Changes' : 'Add to Pantry'}</ThemedText>
                        }
                    </Pressable>
                </ScrollView>
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
        marginVertical: 4,
    },
    fields: { gap: 14 },
    fieldGroup: { gap: 4 },
    label: {
        fontFamily: 'DMSans_600SemiBold',
        fontSize: 12,
        letterSpacing: 0.5,
    },
    input: {
        borderWidth: 1, borderRadius: radius.medium,
        justifyContent: 'center',
        padding: 14,
        fontSize: 14, fontFamily: 'DMSans_400Regular'
    },
    row: {
        flexDirection: 'row', gap: 12,
    },

    pickerWrapper: { paddingVertical: 0, overflow: 'hidden' },
    picker: { height: 48 },
    pickerItem: { fontSize: 14 },

    suggestionsBox: {
        borderWidth: 1, borderRadius: 12,
        marginTop: 4,
        overflow: 'hidden',
    },
    suggestionItem: {
        paddingVertical: 10, paddingHorizontal: 14,
        borderBottomWidth: 1,
    },
    suggestionName: { fontSize: 14, fontWeight: '600', },
    suggestionMeta: { fontSize: 12, marginTop: 1 },

    dateText: { fontSize: 14 },
    datePlaceholder: { fontSize: 14, },

    clearDate: { fontSize: 12, marginTop: 4, textDecorationLine: 'underline', },
    errorText: { fontSize: 13, marginBottom: 8, textAlign: 'center', },

    btn: {
        borderRadius: radius.large, padding: 16,
        alignItems: 'center', marginTop: 14,
    },
    btnText: { fontSize: 16, fontFamily: 'DMSans_600SemiBold', color: '#fff', },
    btnDisabled: { opacity: 0.6 },
    pressed: { opacity: 0.7 },

    calendarWrapper: {
        marginTop: 8,
        borderRadius: radius.small,
        borderWidth: 1, overflow: 'hidden',
    }
})