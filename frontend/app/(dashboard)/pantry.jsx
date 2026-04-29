// This page serves as the pantry page (accessible by bottom nav dashboard) for the app
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native"
import { palette, radius } from "../../constants/colors"
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

// Status colors (fresh, close to expiry, expiring)
const statusColors = {
    fresh: { bar: palette.fresh, badge: palette.freshLight, text: palette.fresh },
    warn: { bar: palette.amber, badge: palette.amberLight, text: palette.amber },
    urgent: { bar: palette.red, badge: palette.redLight, text: palette.red },
}

// Ingredient item card
function IngredientItem({ item }) {
    const sc = statusColors[item.status]
    return (
        <View style={styles.ingredientItem}>
            <View style={[styles.statusBar, { backgroundColor: sc.bar }]} />
            <ThemedText style={styles.ingredientEmoji}>{item.emoji}</ThemedText>
            <View style={{ flex: 1 }}>
                <ThemedText style={styles.ingredientName}>{item.name}</ThemedText>
                <ThemedText style={styles.ingredientQty}>{item.qty}</ThemedText>
            </View>
            <View style={[styles.expiryBadge, { backgroundColor: sc.badge }]}>
                <ThemedText style={[styles.expiryBadgeText, { color: sc.text }]}>{item.badge}</ThemedText>
            </View>
        </View>
    )
}

const Pantry = () => {

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
                <View style={styles.searchBar}>
                    <Text style={{ fontSize: 16 }}>🔍</Text>
                    <TextInput
                        placeholder="Search ingredients..."
                        placeholderTextColor='#C0B8B0'
                        style={styles.searchInput}
                    />
                </View>

                {/* Filter Bar */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                    {FILTERS.map((f, i) => (
                        <Pressable key={f} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
                            <ThemedText style={[styles.filterChipText, i === 0 && styles.filterChipTextActive]}>{f}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Ingredient List */}
                <View style={styles.list}>
                    <ThemedText style={styles.sectionLabel}>EXPIRING SOON</ThemedText>
                    {EXPIRING.map((item) => <IngredientItem key={item.name} item={item} />)}

                    <Spacer height={15} />

                    <ThemedText style={styles.sectionLabel}>ALL GOOD</ThemedText>
                    {FRESH.map((item) => <IngredientItem key={item.name} item={item} />)}
                </View>
            </ScrollView>
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
        backgroundColor: '#fff',
        borderWidth: 1.5, borderColor: palette.beige,
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
    filterChipText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: 'rgba(0,0,0,0.5)' },
    filterChipTextActive: { color: '#fff' },

    list: { paddingHorizontal: 24, gap: 8 },
    sectionLabel: {
        fontFamily: 'DMSans_600SemiBold', fontSize: 10,
        color: palette.warmGray, letterSpacing: 1,
        paddingVertical: 4,
    },

    ingredientItem: {
        borderRadius: radius.small,
        borderWidth: 1, borderColor: palette.beige,
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