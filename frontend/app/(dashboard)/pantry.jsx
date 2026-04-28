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
                <ThemedText style={styles.heading}>
                    This is the Pantry Page.
                </ThemedText>
            </ScrollView>


        </ThemedView>
    )
}
export default Pantry

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
})