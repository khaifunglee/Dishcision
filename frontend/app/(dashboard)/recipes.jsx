// This page serves as a recipe page (accessible by bottom nav dashboard) for the app
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from "react-native"
import { router } from "expo-router"
import { palette, radius } from "../../constants/colors"

// Themed components
import Spacer from "../../components/Spacer"
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"

// Placeholder data
const RECIPES = [
    { emoji: '🍝', name: 'Pasta Arrabiata', meta: 'Italian · 25 min · ~$3.20/serve', match: '100%', matchType: 'full', bg: palette.greenLight },
    { emoji: '🥘', name: 'Chicken Stir Fry', meta: 'Asian · 20 min · ~$4.50/serve', match: '100%', matchType: 'full', bg: palette.amberLight },
    { emoji: '🍳', name: 'Tomato & Egg Scramble', meta: 'Breakfast · 10 min · ~$1.80/serve', match: '100%', matchType: 'full', bg: palette.terracottaLight },
    { emoji: '🥗', name: 'Spinach & Feta Pasta', meta: 'Italian · 20 min · Missing 1', match: '+1 item', matchType: 'partial', bg: palette.freshLight },
    { emoji: '🥩', name: 'Garlic Butter Chicken', meta: 'Western · 35 min · Missing 2', match: '+2 items', matchType: 'partial', bg: palette.creamDark },
    { emoji: '🫕', name: 'Tomato Soup', meta: 'Comfort · 30 min · Missing 2', match: '+2 items', matchType: 'partial', bg: palette.greenLight },
]

const FILTERS = ['Best Match', '🌍 Cuisine', '⏱ Cook Time', '🥗 Dietary', '🔖 Saved']

const Recipes = () => {
    return (
        <ThemedView style={styles.container} safe>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: 16 }]}>
                    <ThemedText style={styles.title} serif>Recipes</ThemedText>
                    <Pressable style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}>
                        <ThemedText style={styles.addBtnText}>+</ThemedText>
                    </Pressable>
                </View>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Text style={{ fontSize: 16 }}>🔍</Text>
                    <TextInput
                        placeholder="Search 38 recipes..."
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

                {/* Recipe List */}
                <View style={styles.sortRow}>
                    <ThemedText style={styles.sortLabel}>Sorted by: </ThemedText>
                    <ThemedText style={styles.sortValue}>Best Match to Pantry</ThemedText>
                </View>

                <View style={styles.list}>
                    {RECIPES.map((recipe) => (
                        <Pressable
                            key={recipe.name}
                            style={({ pressed }) => [styles.recipeItem, pressed && styles.pressed]}
                            onPress={() => router.push('/recipe-detail')}
                        >
                            <View style={[styles.recipeThumb, { backgroundColor: recipe.bg }]}>
                                <ThemedText style={{ fontSize: 28 }}>{recipe.emoji}</ThemedText>
                            </View>
                            <View style={{ flex: 1 }}>
                                <ThemedText style={styles.recipeName}>{recipe.name}</ThemedText>
                                <ThemedText style={styles.recipeMeta}>{recipe.meta}</ThemedText>
                            </View>
                            <View style={[
                                styles.matchPill,
                                recipe.matchType === 'full' ? styles.matchFull : styles.matchPartial
                            ]}>
                                <ThemedText style={[
                                    styles.matchPillText,
                                    recipe.matchType === 'full' ? styles.matchFullText : styles.matchPartialText
                                ]}>
                                    {recipe.match}
                                </ThemedText>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </ThemedView>
    )
}
export default Recipes

const styles = StyleSheet.create({
    container: { flex: 1, },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24, paddingBottom: 16
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

    sortRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 8 },
    sortLabel: { fontSize: 12, color: palette.warmGray },
    sortValue: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: palette.green },

    list: { paddingHorizontal: 24, gap: 12 },
    recipeItem: {
        backgroundColor: '#fff',
        borderRadius: radius.small,
        borderWidth: 1, borderColor: palette.beige,
        padding: 14,
        flexDirection: 'row', alignItems: 'center', gap: 14
    },
    recipeThumb: {
        width: 56, height: 56,
        borderRadius: radius.small,
        alignItems: 'center', justifyContent: 'center',
    },
    recipeName: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, marginBottom: 3 },
    recipeMeta: { fontSize: 10, color: palette.warmGray },
    matchPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radius.full },
    matchFull: { backgroundColor: palette.freshLight },
    matchPartial: { backgroundColor: palette.amberLight },
    matchPillText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10 },
    matchFullText: { color: palette.fresh },
    matchPartialText: { color: palette.amber },

    pressed: { opacity: 0.7 }
})