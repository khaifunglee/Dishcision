// This page serves as the recipe suggestions page (accessible by home page) for the app
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import { useMemo } from 'react'
import { Feather } from '@expo/vector-icons'
import { palette, radius, useAppColors } from "../constants/colors"
// Themed components
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"

// Recipe card item
function RecipeCard({ recipe }) {
    const c = useAppColors()

    // Dynamic styles that depend on theme colors
    const themed = useMemo(() => ({
        card: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
        },
        cookNowChip: {
            backgroundColor: c.freshLight,
            borderColor: c.fresh,
        },
        almostThereChip: {
            backgroundColor: c.amberLight,
            borderColor: c.amber,
        }
    }), [c])

    return (
        <Pressable style={({ pressed }) => [styles.recipeCard, themed.card, pressed && styles.pressed]}
            onPress={() => router.push('/recipe-detail')}
        >
            <View style={[styles.recipeHero, { backgroundColor: recipe.bg }]}>
                <ThemedText style={{ fontSize: 52 }} >{recipe.emoji}</ThemedText>
                <View style={[
                    styles.matchBadge,
                    recipe.badgeType === 'full' ? themed.cookNowChip : themed.almostThereChip
                ]}>
                    <ThemedText style={[styles.matchBadgeText,
                    recipe.badgeType === 'full' ? { color: c.fresh } : { color: c.amber }
                    ]}>
                        {recipe.badge}
                    </ThemedText>
                </View>
            </View>
            <View style={styles.recipeInfo}>
                <ThemedText style={styles.recipeName} serif >{recipe.name}</ThemedText>
                <View style={styles.tagRow}>
                    {recipe.tags.map((tag) => (
                        <View key={tag} style={[
                            styles.tag, { backgroundColor: c.creamDark, borderColor: c.border },
                            tag === 'Uses expiring items' && [styles.tagUrgent, { backgroundColor: c.redLight, borderColor: c.red }]
                        ]}>
                            <ThemedText style={[styles.tagText, tag === 'Uses expiring items' && { color: c.red }]}>
                                {tag}
                            </ThemedText>
                        </View>
                    ))}
                </View>
                {recipe.meta && (
                    <ThemedText style={styles.recipeMeta} subtitle>{recipe.meta}</ThemedText>
                )}
                {recipe.missing && (
                    <ThemedText style={[styles.missingText, { color: c.amber }]}>⚠️ {recipe.missing}</ThemedText>
                )}
            </View>
        </Pressable>
    )
}

const Suggestions = () => {
    const c = useAppColors()

    // Dynamic styles that depend on theme colors
    const themed = useMemo(() => ({
        cookNowChip: {
            backgroundColor: c.freshLight,
            borderColor: c.fresh,
        },
        almostThereChip: {
            backgroundColor: c.amberLight,
            borderColor: c.amber,
        }
    }), [c])

    // Placeholder data for recipes
    const COOK_NOW = [
        { emoji: '🍝', name: 'Pasta Arrabiata', tags: ['Italian', 'Vegetarian', '25 min'], meta: '2 servings · 25 min · ~$3.20/serve', bg: c.greenLight, badge: '✓ Full match', badgeType: 'full' },
        { emoji: '🥘', name: 'Chicken Stir Fry', tags: ['Asian', '20 min', 'Uses expiring items'], meta: '2 servings · 20 min · ~$4.50/serve', bg: c.amberLight, badge: '✓ Full match', badgeType: 'full' },
        { emoji: '🍳', name: 'Tomato & Egg Scramble', tags: ['Breakfast', '10 min'], meta: '1 serving · 10 min · ~$1.80/serve', bg: c.terracottaLight, badge: '✓ Full match', badgeType: 'full' },
    ]

    const ALMOST = [
        { emoji: '🥗', name: 'Spinach & Feta Pasta', tags: ['Italian', 'Vegetarian', '20 min'], missing: 'Missing: Feta cheese (100g)', bg: c.freshLight, badge: '+ 1 item', badgeType: 'partial' },
        { emoji: '🥩', name: 'Garlic Butter Chicken', tags: ['Western', '35 min'], missing: 'Missing: Butter, Lemon', bg: c.creamDark, badge: '+ 2 items', badgeType: 'partial' },
    ]
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
                            <View style={[styles.badge, themed.cookNowChip]}>
                                <ThemedText style={[styles.badgeText, { color: c.fresh }]}>5 recipes</ThemedText>
                            </View>
                        </View>
                        {COOK_NOW.map((r) => <RecipeCard key={r.name} recipe={r} />)}
                    </View>

                    {/* Almost There */}
                    <View>
                        <View style={styles.sectionTitleRow}>
                            <ThemedText style={styles.sectionTitle} serif>Almost There</ThemedText>
                            <View style={[styles.badge, themed.almostThereChip]}>
                                <ThemedText style={[styles.badgeText, { color: c.amber }]}>3 recipes</ThemedText>
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
        paddingVertical: 4, paddingHorizontal: 8,
        borderRadius: radius.full, borderWidth: 1,
    },
    badgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10, },

    recipeCard: {
        borderRadius: radius.large, borderWidth: 1,
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
    matchBadgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10, },

    recipeInfo: { padding: 16 },
    recipeName: { fontSize: 18, letterSpacing: -0.5, marginBottom: 6, },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
    tag: {
        paddingVertical: 3, paddingHorizontal: 10,
        borderWidth: 1, borderRadius: radius.full,
    },
    tagUrgent: { backgroundColor: palette.redLight, borderColor: '#FABEBE', },
    tagText: { fontFamily: 'DMSans_500Medium', fontSize: 10, },
    tagTextUrgent: { color: palette.red },
    recipeMeta: { fontSize: 12, },
    missingText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, },

    pressed: { opacity: 0.7 }
})