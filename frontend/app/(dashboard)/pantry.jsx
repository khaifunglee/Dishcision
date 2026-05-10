// This page serves as the pantry page (accessible by bottom nav dashboard) for the app
import { router } from 'expo-router'
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native"
import { useMemo, useEffect } from "react"
import { palette, radius, useAppColors } from "../../constants/colors"
import { useOnboarding } from "../../context/OnboardingContext"

import OnboardingOverlay from "../../components/OnboardingOverlay" // Pantry page shows step 2
// Themed components
import Spacer from "../../components/Spacer"
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"

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

const FILTERS = ['All (12)', '🔴 Expiring (3)', '🥩 Protein', '🥦 Produce', '🥫 Pantry', '🧀 Dairy']

// Ingredient item card
function IngredientItem({ item }) {

    const c = useAppColors()

    // Dynamic styles that depend on theme colours
    const themed = useMemo(() => ({
        card: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
        },
    }), [c])

    // Status colors (fresh, close to expiry, expiring)
    const statusColors = {
        fresh: { bar: c.fresh, badge: c.freshLight, text: c.fresh },
        warn: { bar: c.amber, badge: c.amberLight, text: c.amber },
        urgent: { bar: c.red, badge: c.redLight, text: c.red },
    }
    const sc = statusColors[item.status]
    return (
        <View style={[styles.ingredientItem, themed.card]}>
            <View style={[styles.statusBar, { backgroundColor: sc.bar }]} />
            <ThemedText style={styles.ingredientEmoji}>{item.emoji}</ThemedText>
            <View style={{ flex: 1 }}>
                <ThemedText style={styles.ingredientName}>{item.name}</ThemedText>
                <ThemedText style={styles.ingredientQty} subtitle>{item.qty}</ThemedText>
            </View>
            <View style={[styles.expiryBadge, { backgroundColor: sc.badge }]}>
                <ThemedText style={[styles.expiryBadgeText, { color: sc.text }]}>{item.badge}</ThemedText>
            </View>
        </View>
    )
}

const Pantry = () => {

    const c = useAppColors()
    const { shouldOnboard, completeOnboarding } = useOnboarding()
    const [showOverlay, setShowOverlay] = useState(false)

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

    return (
        <ThemedView style={styles.container} safe>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: 16 }]}>
                    <ThemedText style={styles.title} serif>Pantry</ThemedText>
                    <Pressable style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
                        <ThemedText style={styles.addBtnText}>+</ThemedText>
                    </Pressable>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchBar, themed.card]}>
                    <Text style={{ fontSize: 16 }}>🔍</Text>
                    <TextInput
                        placeholder="Search ingredients..."
                        placeholderTextColor='#D2CEC6'
                        style={styles.searchInput}
                    />
                </View>

                {/* Filter Bar */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                    {FILTERS.map((f, i) => (
                        <Pressable key={f} style={[styles.filterChip, themed.card, i === 0 && themed.filterChipActive]}>
                            <ThemedText style={[styles.filterChipText, i === 0 && styles.filterChipTextActive]} subtitle >{f}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Ingredient List */}
                <View style={styles.list}>
                    <ThemedText style={styles.sectionLabel} subtitle>EXPIRING SOON</ThemedText>
                    {EXPIRING.map((item) => <IngredientItem key={item.name} item={item} />)}

                    <Spacer height={15} />

                    <ThemedText style={styles.sectionLabel} subtitle>ALL GOOD</ThemedText>
                    {FRESH.map((item) => <IngredientItem key={item.name} item={item} />)}
                </View>
            </ScrollView>
            {/* Onboarding Overlay */}
            <OnboardingOverlay
                visible={showOverlay}
                step={2} total={3}
                body='Your pantry stores all your ingredients with colour-coded expiry dates. Tap + to add items.'
                onNext={handleNext}
                onSkip={handleSkip}
            />
        </ThemedView>
    )
}
export default Pantry

const styles = StyleSheet.create({
    container: { flex: 1 },
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

    filterRow: { paddingHorizontal: 24, paddingBottom: 16, gap: 8 },
    filterChip: {
        paddingVertical: 6, paddingHorizontal: 16,
        borderRadius: radius.full,
        borderWidth: 1.5, borderColor: palette.beige,
        alignItems: 'center', justifyContent: 'center',
    },
    filterChipActive: { backgroundColor: palette.green, borderColor: palette.green, },
    filterChipText: { fontFamily: 'DMSans_500Medium', fontSize: 12, },
    filterChipTextActive: { color: '#fff' },

    list: { paddingHorizontal: 24, gap: 8 },
    sectionLabel: {
        fontFamily: 'DMSans_600SemiBold', fontSize: 10,
        letterSpacing: 1,
        paddingVertical: 4,
    },

    ingredientItem: {
        borderRadius: radius.small, borderWidth: 1,
        padding: 14,
        flexDirection: 'row', alignItems: 'center', gap: 14,
        overflow: 'hidden',
    },
    statusBar: {
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        borderRadius: 2,
    },
    ingredientEmoji: { fontSize: 24 },
    ingredientName: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, },
    ingredientQty: { fontSize: 12, },
    expiryBadge: {
        paddingVertical: 4, paddingHorizontal: 10,
        borderRadius: radius.full,
    },
    expiryBadgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10 },

    pressed: { opactiy: 0.7 }
})