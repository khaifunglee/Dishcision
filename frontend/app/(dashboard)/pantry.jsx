// This page serves as the pantry page (accessible by bottom nav dashboard) for the app
import { router } from 'expo-router'
import {
    View, Text, StyleSheet, SectionList, Alert,
    RefreshControl, ActivityIndicator, ScrollView,
    Pressable, TextInput, FlatList
} from "react-native"
import { useMemo, useEffect, useState, useCallback } from "react"

import { palette, radius, useAppColors } from "../../constants/colors"
import { useOnboarding } from "../../context/OnboardingContext"
import { useToast } from '../../hooks/useToast'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useFocusEffect } from 'expo-router'

import OnboardingOverlay from "../../components/OnboardingOverlay" // Pantry page shows step 2
// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Toast from '../../components/Toast'
import AddIngredientSheet from '../../components/AddIngredientSheet'
import EditIngredientSheet from '../../components/EditIngredientSheet'
import { deleteItem, getAll } from '../../api/pantryApi'

// Placeholder data
const EXPIRING = [
    { emoji: '🥬', name: 'Spinach', qty: '1 bag · 200g', status: 'urgent', badge: 'Today' },
    { emoji: '🍗', name: 'Chicken Breast', qty: '2 pieces', status: 'urgent', badge: 'Tomorrow' },
    { emoji: '🍅', name: 'Tomatoes', qty: '4 pieces', status: 'warn', badge: '2 days' },
]

const FRESH = [
    { emoji: '🥚', name: 'Eggs', qty: '6 pieces', status: 'fresh', badge: '12 days' },
    { emoji: '🧄', name: 'Garlic', qty: '1 head', status: 'fresh', badge: '14 days' },
    { emoji: '🍝', name: 'Pasta (Penne)', qty: '400g', status: 'fresh', badge: '6 months' },
    { emoji: '🧅', name: 'Onion', qty: '2 pieces', status: 'fresh', badge: '21 days' },
    { emoji: '🫙', name: 'Olive Oil', qty: '500ml', status: 'fresh', badge: '8 months' },
    { emoji: '🧀', name: 'Parmesan', qty: '200g', status: 'fresh', badge: '18 days' },
]

const CATEGORY_EMOJIS = {
    'Protein': '🥩', 'Produce': '🥦', 'Dairy': '🧀', 'Pantry Staple': '🥫', 'Frozen': '❄️', 'Other': '🫙'
}

const FILTER_CHIPS = [
    { key: 'all', label: 'All' },
    { key: 'expiring', label: '🔴 Expiring' },
    { key: 'Protein', label: '🥩 Protein' },
    { key: 'Produce', label: '🥦 Produce' },
    { key: 'Pantry Staple', label: '🥫 Pantry' },
    { key: 'Dairy', label: '🧀 Dairy' },
];

// Expiry date calculate helpers
function getExpiryStatus(expiryDate) {
    if (!expiryDate) return 'fresh'
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expiry = new Date(expiryDate)
    expiry.setHours(0, 0, 0, 0)

    const diff = Math.ceil((expiry - today) / 86400000)
    if (diff <= 1) return 'urgent'
    if (diff <= 3) return 'warn'
    return 'fresh'
}
function getExpiryLabel(expiryDate) {
    if (!expiryDate) return 'No expiry'
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const expiry = new Date(expiryDate)
    expiry.setHours(0, 0, 0, 0)

    const diff = Math.ceil((expiry - today) / 86400000)
    if (diff < 0) return 'Expired'
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    if (diff < 30) return `${diff} days`
    return `${Math.floor(diff / 30)} months`
}
// Get label of emoji label for ingredient
function getIngredientEmoji(item) {
    const name = item.ingredientName?.toLowerCase() || '';
    const map = {
        'chicken': '🍗', 'egg': '🥚', 'spinach': '🥬', 'tomato': '🍅',
        'carrot': '🥕', 'broccoli': '🥦', 'garlic': '🧄', 'onion': '🧅',
        'lemon': '🍋', 'pasta': '🍝', 'rice': '🍚', 'milk': '🥛',
        'cheese': '🧀', 'butter': '🧈', 'olive oil': '🫙', 'flour': '🌾',
        'sugar': '🍬', 'soy sauce': '🥢',
    };
    for (const [key, emoji] of Object.entries(map)) {
        if (name.includes(key)) return emoji;
    }
    return CATEGORY_EMOJIS[item.category] || '🥘';
}

// Ingredient item card (swipe to remove ingredient)
function IngredientItem({ item, onEdit, onDelete }) {

    const c = useAppColors()
    // Dynamic styles that depend on theme colours
    const themed = useMemo(() => ({
        card: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
        },
    }), [c])
    const status = getExpiryStatus(item.expiryDate)
    const label = getExpiryLabel(item.expiryDate)

    // Status colors (fresh, close to expiry, expiring)
    const statusStyles = {
        fresh: { bar: c.fresh, badge: c.freshLight, text: c.fresh },
        warn: { bar: c.amber, badge: c.amberLight, text: c.amber },
        urgent: { bar: c.red, badge: c.redLight, text: c.red },
    }
    const s = statusStyles[status]

    const renderRightActions = () => (
        <Pressable
            style={[styles.swipeDelete, { backgroundColor: c.red }]}
            onPress={() => {
                Alert.alert('Remove Item', `Remove ${item.ingredientName} from your pantry?`,
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => onDelete(item.id) },
                    ]
                )
            }}
        >
            <ThemedText style={{ fontSize: 12, justifyContent: 'center' }}>🗑️</ThemedText>
            <ThemedText style={[styles.swipeDeleteLabel, { color: c.redLight }]}>Remove</ThemedText>
        </Pressable>
    )

    return (
        <Swipeable renderRightActions={renderRightActions} overShootRight={false}>
            <Pressable style={[styles.ingredientRow, themed.card]} onPress={() => onEdit(item)} activeOpacity={0.7}>
                <View style={[styles.expiryBar, { backgroundColor: s.bar }]} />
                <ThemedText style={styles.ingredientEmoji}>{getIngredientEmoji(item)}</ThemedText>
                <View style={styles.ingredientInfo}>
                    <ThemedText style={styles.ingredientName}>{item.ingredientName}</ThemedText>
                    <ThemedText style={styles.ingredientQty} subtitle>
                        {item.quantity} {item.unit}
                    </ThemedText>
                </View>
                <View style={[styles.expiryBadge, { backgroundColor: s.badge }]}>
                    <ThemedText style={[styles.expiryBadgeText, { color: s.text }]}>{label}</ThemedText>
                </View>
            </Pressable>
        </Swipeable>
    )
}

const Pantry = () => {

    const c = useAppColors()
    // Onboarding overlay constants
    const { shouldOnboard, completeOnboarding } = useOnboarding()
    const [showOverlay, setShowOverlay] = useState(false)
    // Quick add, edit sheet modal and toast message constants
    const [sheetVisible, setSheetVisible] = useState(false)
    //const [editSheetVisible, setEditSheetVisible] = useState(false)
    const [items, setItems] = useState([])                             // pantry items to be loaded onto page
    const [loading, setLoading] = useState(true)                       // loading pantry items state
    const [refreshing, setRefreshing] = useState(false)
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [addingItem, setAddingItem] = useState(null)
    const [editingItem, setEditingItem] = useState(null)
    const [selectedIngredient, setSelectedIngredient] = useState(null) // track which ingredient was selected for editing

    const { toast, showToast } = useToast()

    // Dynamic styles that depend on theme colours
    const themed = useMemo(() => ({
        card: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
        },
        signatureColor: {
            color: c.green,
        },
        filterChipActive: {
            backgroundColor: c.green,
            borderColor: c.green,
        }
    }), [c])

    // Load pantry items
    const fetchPantry = useCallback(async () => {
        try {
            console.log('Retrieving pantry items...')
            const data = await getAll()
            setItems(data)
            console.log('List: ', data)
        } catch (e) {
            Alert.alert('Error', 'Could not load your pantry. Please try again.')
            console.log('Error: ', e)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])

    // Reload list everytime pantry page comes into focus
    useFocusEffect(useCallback(() => { fetchPantry() }, [fetchPantry]))
    const onRefresh = () => { setRefreshing(true); fetchPantry() }

    // Add item function
    const handleSaved = (savedItem, wasEditing) => {
        console.log('handleAdded received:', JSON.stringify(savedItem)); // add this
        if (wasEditing) {
            setItems(prev => prev.map(i => i.id === savedItem.id ? savedItem : i));
        } else {
            setItems(prev => [...prev, savedItem]);
        }
        showToast('✓ Ingredient added to pantry!')
    }

    // Delete item function
    const handleDelete = async (id) => {
        try {
            console.log('Removing pantry item id: ', id)
            await deleteItem(id)
            setItems(prev => prev.filter(i => i.id !== id))
        } catch (e) {
            Alert.alert('Error', 'Could not remove item. Please try again.')
            console.log('Error: ', e)
        }
    }
    // Functions to open add/edit modal sheet
    const openAdd = () => { setEditingItem(null); setSheetVisible(true) }
    const openEdit = (item) => { setEditingItem(item); setSheetVisible(true) }

    // Filter + Search function
    const filteredItems = useMemo(() => {
        let result = items

        if (search.trim().length > 0) {
            const q = search.toLowerCase()
            result = result.filter(i => i.ingredientName.toLowerCase().includes(q))
        }
        // Filter expiring items
        if (activeFilter === 'expiring') {
            result = result.filter(i => ['urgent', 'warn'].includes(getExpiryStatus(i.expiryDate)))
            // Filter items by category
        } else if (activeFilter !== 'all') {
            result = result.filter(i => i.category === activeFilter)
        }

        return result
    }, [items, search, activeFilter])

    // Pantry item sections (expiring soon, all good)
    const sections = useMemo(() => {
        const expiring = filteredItems.filter(i =>
            ['urgent', 'warn'].includes(getExpiryStatus(i.expiryDate))
        )
        const allGood = filteredItems.filter(i =>
            ['fresh'].includes(getExpiryStatus(i.expiryDate))
        )

        const result = []
        if (expiring.length > 0) result.push({ title: 'EXPIRING SOON', data: expiring })
        if (allGood.length > 0) result.push({ title: 'ALL GOOD', data: allGood })

        return result
    }, [filteredItems])

    const totalCount = items.length

    // Hook to show onboarding overlay
    useEffect(() => {
        if (shouldOnboard) setShowOverlay(true)
    }, [shouldOnboard])
    // Functions to skip or go to next onboarding 
    const handleNext = () => {
        setShowOverlay(false)
        router.push('/recipes')
    }
    const handleSkip = async () => {
        setShowOverlay(false)
        await completeOnboarding()
    }

    // Loading screen
    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator color={c.green} size='large' />
            </View>
        )
    }

    return (
        <ThemedView style={styles.container} safe>
            {/* Header */}
            <View style={[styles.header, { paddingTop: 16 }]}>
                <ThemedText style={styles.title} serif>Pantry</ThemedText>
                <Pressable style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                    onPress={openAdd}>
                    <ThemedText style={styles.addBtnText}>+</ThemedText>
                </Pressable>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchBar, themed.card]}>
                <Text style={{ fontSize: 16 }}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search ingredients..."
                    placeholderTextColor='#D2CEC6'
                    clearButtonMode='while-editing'
                />
            </View>


            <SectionList
                sections={sections}
                keyExtractor={item => item.id.toString()}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.green} />}
                ListHeaderComponent={
                    /* Filter Bar */
                    <FlatList
                        horizontal
                        data={FILTER_CHIPS}
                        keyExtractor={item => item.key}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterRow}
                        renderItem={({ item: chip }) => (
                            <Pressable style={[styles.filterChip, themed.card, activeFilter === chip.key && themed.filterChipActive]}
                                onPress={() => setActiveFilter(chip.key)}
                            >
                                <ThemedText style={[styles.filterChipText, activeFilter === chip.key && styles.filterChipTextActive]} subtitle >
                                    {chip.key === 'all' ? `All (${totalCount})` : chip.label}
                                </ThemedText>
                            </Pressable>
                        )}
                    />

                }
                /* Ingredient List */
                renderSectionHeader={({ section }) => (
                    <ThemedText style={styles.sectionLabel} subtitle>{section.title}</ThemedText>
                )}
                renderItem={({ item }) => (
                    <View style={styles.rowWrapper}>
                        <IngredientItem item={item} onEdit={openEdit} onDelete={handleDelete} />
                    </View>
                )}
                /* Empty state list */
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <ThemedText style={styles.emptyEmoji}>🛒</ThemedText>
                        <ThemedText style={styles.emptyTitle} serif>
                            {search || activeFilter !== 'all' ? 'No matches found' : 'Your pantry is empty.'}
                        </ThemedText>
                        <ThemedText style={styles.emptySubtitle} subtitle>
                            {search || activeFilter !== 'all'
                                ? 'Try a different search or filter'
                                : 'Tap + to add your first ingredient!'}
                        </ThemedText>
                    </View>
                }
                contentContainerStyle={sections.length === 0 ? { flex: 1 } : { paddingBottom: 100 }}
                stickySectionHeadersEnabled={false}
            />

            {/* Onboarding Overlay */}
            <OnboardingOverlay
                visible={showOverlay}
                step={2} total={3}
                body='Your pantry stores all your ingredients with colour-coded expiry dates. Tap + to add items.'
                onNext={handleNext}
                onSkip={handleSkip}
            />
            {/* Toast Message */}
            <Toast message={toast.message} visible={toast.visible} />
            <AddIngredientSheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                onSaved={handleSaved}
                editingItem={editingItem}
            />
            <EditIngredientSheet
                visible={sheetVisible}
                ingredient={selectedIngredient}
                onClose={() => setSheetVisible(false)}
                onSave={handleSaved}
                onDelete={() => showToast('✓ Ingredient removed from pantry')}
            />
        </ThemedView>
    )
}
export default Pantry

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { justifyContent: 'center', alignItems: 'center' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24, paddingBottom: 16,
    },
    title: {
        fontSize: 32,
        letterSpacing: -1,
    },
    addBtn: {
        width: 40, height: 40,
        backgroundColor: palette.green,
        borderRadius: radius.small,
        alignItems: 'center', justifyContent: 'center',
    },
    addBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        marginHorizontal: 24, marginBottom: 12,
        borderWidth: 1.5,
        borderRadius: 14, padding: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'DMSans_400Regular',
    },

    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 24, paddingBottom: 16, gap: 8
    },
    filterChip: {
        paddingVertical: 6, paddingHorizontal: 16,
        borderRadius: radius.full,
        borderWidth: 1.5, borderColor: palette.beige,
        alignItems: 'center', justifyContent: 'center',
    },
    filterChipActive: { backgroundColor: palette.green, borderColor: palette.green, },
    filterChipText: { fontFamily: 'DMSans_500Medium', fontSize: 12, },
    filterChipTextActive: { color: '#fff' },

    //list: { paddingHorizontal: 24, gap: 8 },
    sectionLabel: {
        fontFamily: 'DMSans_600SemiBold', fontSize: 10,
        letterSpacing: 1,
        marginLeft: 28, marginVertical: 8,
    },
    rowWrapper: { paddingHorizontal: 24, marginBottom: 8 },

    ingredientRow: {
        borderRadius: radius.medium, borderWidth: 1,
        flexDirection: 'row', alignItems: 'center',
        padding: 14,
        overflow: 'hidden'
    },
    expiryBar: {
        borderRadius: radius.full,
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 6,
    },
    ingredientEmoji: { fontSize: 24, marginLeft: 8 },
    ingredientInfo: { flex: 1, marginLeft: 16 },
    ingredientName: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, },
    ingredientQty: { fontSize: 12, },
    expiryBadge: {
        paddingVertical: 4, paddingHorizontal: 10,
        borderRadius: radius.full,
    },
    expiryBadgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10 },

    swipeDelete: {
        width: 70, height: '100%',
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 12, marginBottom: 8, marginHorizontal: 12,
    },
    swipeDeleteLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },

    emptyState: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 40, paddingTop: 60,
    },
    emptyEmoji: { fontSize: 56, marginBottom: 16 },
    emptyTitle: { fontSize: 20, textAlign: 'center', marginBottom: 8, },
    emptySubtitle: { fontSize: 14, textAlign: 'center' },

    pressed: { opactiy: 0.7 }
})