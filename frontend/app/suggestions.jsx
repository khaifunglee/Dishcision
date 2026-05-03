// This page serves as the recipe suggestions page (accessible by home page) for the app
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import { Feather } from '@expo/vector-icons'
import { palette, radius } from "../constants/colors"
// Themed components
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"

// Placeholder data for recipes
const COOK_NOW = [
    { emoji: '🍝', name: 'Pasta Arrabiata', tags: ['Italian', 'Vegetarian', '25 min'], meta: '2 servings · 25 min · ~$3.20/serve', bg: ['#EBF2E6', '#C8E0BC'], badge: '✓ Full match', badgeType: 'full' },
    { emoji: '🥘', name: 'Chicken Stir Fry', tags: ['Asian', '20 min', 'Uses expiring items'], meta: '2 servings · 20 min · ~$4.50/serve', bg: ['#FEF3E6', '#FBDAB8'], badge: '✓ Full match', badgeType: 'full' },
    { emoji: '🍳', name: 'Tomato & Egg Scramble', tags: ['Breakfast', '10 min'], meta: '1 serving · 10 min · ~$1.80/serve', bg: ['#FAEEE7', '#F5C9AE'], badge: '✓ Full match', badgeType: 'full' },
]

const ALMOST = [
    { emoji: '🥗', name: 'Spinach & Feta Pasta', tags: ['Italian', 'Vegetarian', '20 min'], missing: 'Missing: Feta cheese (100g)', bg: ['#EAF4E4', '#B8DFAE'], badge: '+ 1 item', badgeType: 'partial' },
    { emoji: '🥩', name: 'Garlic Butter Chicken', tags: ['Western', '35 min'], missing: 'Missing: Butter, Lemon', bg: ['#F2EBE1', '#E2D0BC'], badge: '+ 2 items', badgeType: 'partial' },
]

// Recipe card item
function RecipeCard({ recipe }) {
    return (
        <Pressable style={({ pressed }) => [styles.recipeCard, pressed && styles.pressed]}
            onPress={() => router.push('/recipe-detail')}
        >
            <View style={[styles.recipeHero, { backgroundColor: recipe.bg[0] }]}>
                <ThemedText style={{ fontSize: 52 }} >{recipe.emoji}</ThemedText>
                <View style={[
                    styles.matchBadge,
                    recipe.badgeType === 'full' ? styles.matchBadgeFull : styles.matchBadgePartial
                ]}>
                    <ThemedText style={styles.matchBadgeText}>{recipe.badge}</ThemedText>
                </View>
            </View>
            <View style={styles.recipeInfo}>
                <ThemedText style={styles.recipeName} serif >{recipe.name}</ThemedText>
                <View style={styles.tagRow}>
                    {recipe.tags.map((tag) => (
                        <View key={tag} style={[
                            styles.tag,
                            tag === 'Uses expiring items' && styles.tagUrgent
                        ]}>
                            <ThemedText style={[styles.tagText, tag === 'Uses expiring items' && styles.tagTextUrgent]}>
                                {tag}
                            </ThemedText>
                        </View>
                    ))}
                </View>
                {recipe.meta && (
                    <ThemedText style={styles.recipeMeta}>{recipe.meta}</ThemedText>
                )}
                {recipe.missing && (
                    <ThemedText style={styles.missingText}>⚠️ {recipe.missing}</ThemedText>
                )}
            </View>
        </Pressable>
    )
}

const Suggestions = () => {
    return (
        <ThemedView style={styles.container} >
            {/* Use safe=true for safeAreaView */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: 52, }]}>
                    <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                        onPress={() => router.back()}>
                        <Feather name={'chevron-left'} size={22} color={'white'} />
                    </Pressable>
                    <View>
                        <ThemedText style={styles.headerTitle} serif >Today's Dishcisions 🍽️</ThemedText>
                        <ThemedText style={styles.headerSub}>Based on your 12 pantry items</ThemedText>
                    </View>
                </View>

                <View style={styles.body}>
                    {/* Cook Now */}
                    <View>
                        <View style={styles.sectionTitleRow}>
                            <ThemedText style={styles.sectionTitle} serif>Cook Now</ThemedText>
                            <View style={styles.badge}>
                                <ThemedText style={styles.badgeText}>5 recipes</ThemedText>
                            </View>
                        </View>
                        {COOK_NOW.map((r) => <RecipeCard key={r.name} recipe={r} />)}
                    </View>

                    {/* Almost There */}
                    <View>
                        <View style={styles.sectionTitleRow}>
                            <ThemedText style={styles.sectionTitle} serif>Almost There</ThemedText>
                            <View style={[styles.badge, styles.badgeAmber]}>
                                <ThemedText style={[styles.badgeText, styles.badgeTextAmber]}>3 recipes</ThemedText>
                            </View>
                        </View>
                        {ALMOST.map((r) => <RecipeCard key={r.name} recipe={r} />)}
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    )
}
export default Suggestions

const styles = StyleSheet.create({
    container: { flex: 1, },
    header: {
        backgroundColor: palette.green,
        paddingHorizontal: 24,
        paddingBottom: 28,
    },
    backBtn: {
        borderWidth: 0.6,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: radius.medium,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: { fontSize: 26, color: '#F5A675', letterSpacing: -0.5, },
    headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', },

    body: { padding: 24, gap: 24 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12, },
    sectionTitle: { fontSize: 20, letterSpacing: -0.5, },

    badge: {
        backgroundColor: palette.freshLight,
        paddingVertical: 4, paddingHorizontal: 8,
        borderRadius: radius.full,
    },
    badgeAmber: { backgroundColor: palette.amberLight },
    badgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10, color: palette.fresh },
    badgeTextAmber: { color: palette.amber },

    recipeCard: {
        backgroundColor: '#fff',
        borderRadius: radius.large,
        borderWidth: 1, borderColor: palette.beige,
        overflow: 'hidden',
        marginBottom: 12,
    },
    recipeHero: {
        height: 120,
        alignItems: 'center', justifyContent: 'center',
    },
    matchBadge: {
        position: 'absolute', top: 12, right: 12,
        paddingVertical: 5, paddingHorizontal: 10,
        borderRadius: radius.full,
    },
    matchBadgeFull: { backgroundColor: palette.fresh },
    matchBadgePartial: { backgroundColor: palette.amber },
    matchBadgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10, color: '#fff', },

    recipeInfo: { padding: 16 },
    recipeName: { fontSize: 18, letterSpacing: -0.5, marginBottom: 6, },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
    tag: {
        paddingVertical: 3, paddingHorizontal: 10,
        backgroundColor: palette.creamDark,
        borderWidth: 1, borderColor: palette.beige,
        borderRadius: radius.full,
    },
    tagUrgent: { backgroundColor: palette.redLight, borderColor: '#FABEBE', },
    tagText: { fontFamily: 'DMSans_500Medium', fontSize: 10, color: palette.warmGray },
    tagTextUrgent: { color: palette.red },
    recipeMeta: { fontSize: 12, color: palette.warmGray },
    missingText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: palette.amber, },

    pressed: { opacity: 0.7 }
})