// Suggestions screen — renders two-tier layout categorized by recipe match type
import { router, useFocusEffect } from 'expo-router'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native"
import { useCallback, useMemo, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { palette, radius, useAppColors } from "../constants/colors"
import { getSuggestions } from '../api/recipeApi'
// Themed components
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"

// Map emojis to cuisine as thumbnail
const CUISINE_EMOJIS = {
    Italian: '🍝', Asian: '🥢', Western: '🍳', Comfort: '🫕', Breakfast: '🥞',
}
// Recipe card item
function RecipeCard({ recipe }) {
    const c = useAppColors()

    const themed = useMemo(() => ({
        card: { backgroundColor: c.uiBackground, borderColor: c.border },
        fullChip: { backgroundColor: c.fresh, borderColor: c.fresh },
        nearChip: { backgroundColor: c.amber, borderColor: c.amber },
    }), [c])

    const isFullMatch = recipe.totalRequired === 0 || recipe.matchedCount === recipe.totalRequired
    const missing = recipe.totalRequired - recipe.matchedCount
    const emoji = CUISINE_EMOJIS[recipe.cuisine] || '🍽️'
    // Tags - cuisine, cook time, dietary tags
    const tags = [
        recipe.cuisine,
        recipe.cookTimeMins && `${recipe.cookTimeMins} min`,
        ...(recipe.dietaryTags || []).map(t =>
            ({ VEGETARIAN: 'Vegetarian', VEGAN: 'Vegan', GLUTEN_FREE: 'Gluten-Free' }[t] || t))
    ].filter(Boolean)

    return (
        <Pressable
            style={({ pressed }) => [styles.recipeCard, themed.card, pressed && styles.pressed]}
            onPress={() => router.push({ pathname: '/recipe-detail', params: { id: recipe.id } })}>
            <View style={[styles.recipeHero, { backgroundColor: c.greenLight }]}>
                <ThemedText style={{ fontSize: 52 }}>{emoji}</ThemedText>
                <View style={[styles.matchBadge, isFullMatch ? themed.fullChip : themed.nearChip]}>
                    <ThemedText style={[styles.matchBadgeText,
                        { color: '#fff' }]}>
                        {isFullMatch ? '✓ Full match' : `+${missing} item${missing === 1 ? '' : 's'}`}
                    </ThemedText>
                </View>
            </View>
            <View style={styles.recipeInfo}>
                <ThemedText style={styles.recipeName} serif>{recipe.name}</ThemedText>
                <View style={styles.tagRow}>
                    {/* No more than 3 tags per row */}
                    {tags.slice(0, 3).map(tag => (
                        <View key={tag} style={[styles.tag, { backgroundColor: c.creamDark, borderColor: c.border }]}>
                            <ThemedText style={styles.tagText}>{tag}</ThemedText>
                        </View>
                    ))}
                </View>
                {/* Stats row */}
                <ThemedText style={styles.recipeMeta} subtitle>
                    {[recipe.servings && `${recipe.servings} servings`,
                      recipe.costPerServe && `~$${Number(recipe.costPerServe).toFixed(2)}/serve`]
                     .filter(Boolean).join(' · ')}
                </ThemedText>
                {/* Missing ingredients row */}
                {!isFullMatch && recipe.missingIngredients?.length > 0 && (
                    <ThemedText style={[styles.missingText, { color: c.amber }]}>
                        ⚠️ Missing: {recipe.missingIngredients.map(m => m.ingredientName).join(', ')}
                    </ThemedText>
                )}
            </View>
        </Pressable>
    )
}

const Suggestions = () => {
    const c = useAppColors()
    const [data, setData] = useState(null)          // suggestions to load
    const [loading, setLoading] = useState(true)    // loading state for suggestions

    useFocusEffect(useCallback(() => {
        const load = async () => {
            try {
                setLoading(true)
                const result = await getSuggestions()
                setData(result)
            } catch (e) {
                console.error('Failed to load suggestions:', e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, []))

    const themed = useMemo(() => ({
        fullChip: { backgroundColor: c.freshLight, borderColor: c.fresh },
        nearChip: { backgroundColor: c.amberLight, borderColor: c.amber },
    }), [c])

    const fullMatch = data?.fullMatch || []
    const nearMatch = data?.nearMatch || []
    const pantryCount = data?.pantryItemCount || 0

    return (
        <ThemedView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: 52 }]}>
                    <Pressable
                        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                        onPress={() => router.back()}>
                        <Feather name='chevron-left' size={22} color='white' />
                    </Pressable>
                    <View>
                        <ThemedText style={styles.headerTitle} serif>
                            Today's Dishcisions 🍽️
                        </ThemedText>
                        <ThemedText style={styles.headerSub}>
                            {loading
                                ? 'Loading your pantry...'
                                : `Based on your ${pantryCount} pantry item${pantryCount === 1 ? '' : 's'}`}
                        </ThemedText>
                    </View>
                </View>

                {loading ? (
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <ActivityIndicator size='large' color={c.green} />
                    </View>
                ) : pantryCount === 0 ? (
                    <View style={styles.emptyState}>
                        <ThemedText style={styles.emptyEmoji}>🛒</ThemedText>
                        <ThemedText style={styles.emptyTitle} serif>Your pantry is empty</ThemedText>
                        <ThemedText style={styles.emptySubtitle} subtitle>
                            Add some ingredients to your pantry and we'll find recipes you can cook right now.
                        </ThemedText>
                        <Pressable
                            style={({ pressed }) => [styles.addPantryBtn, pressed && styles.pressed]}
                            onPress={() => router.push('/pantry')}>
                            <ThemedText style={styles.addPantryBtnText}>Add ingredients →</ThemedText>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.body}>
                        {/* Cook Now section */}
                        <View>
                            <View style={styles.sectionTitleRow}>
                                <ThemedText style={styles.sectionTitle} serif>Cook Now</ThemedText>
                                <View style={[styles.badge, themed.fullChip]}>
                                    <ThemedText style={[styles.badgeText, { color: c.fresh }]}>
                                        {fullMatch.length} recipe{fullMatch.length === 1 ? '' : 's'}
                                    </ThemedText>
                                </View>
                            </View>
                            {fullMatch.length === 0 ? (
                                <ThemedText style={styles.emptySectionText} subtitle>
                                    No full matches yet — check the "Almost There" section below.
                                </ThemedText>
                            ) : (
                                fullMatch.map(r => <RecipeCard key={r.id} recipe={r} />)
                            )}
                        </View>

                        {/* Almost There section */}
                        {nearMatch.length > 0 && (
                            <View>
                                <View style={styles.sectionTitleRow}>
                                    <ThemedText style={styles.sectionTitle} serif>Almost There</ThemedText>
                                    <View style={[styles.badge, themed.nearChip]}>
                                        <ThemedText style={[styles.badgeText, { color: c.amber }]}>
                                            {nearMatch.length} recipe{nearMatch.length === 1 ? '' : 's'}
                                        </ThemedText>
                                    </View>
                                </View>
                                {nearMatch.map(r => <RecipeCard key={r.id} recipe={r} />)}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </ThemedView>
    )
}
export default Suggestions

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { backgroundColor: palette.green, paddingHorizontal: 24, paddingBottom: 28 },
    backBtn: {
        borderWidth: 0.6,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: radius.medium,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    },
    headerTitle: { fontSize: 26, color: '#F5A675', letterSpacing: -0.5 },
    headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)' },

    body: { padding: 24, gap: 24 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
    sectionTitle: { fontSize: 20, letterSpacing: -0.5 },
    badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: radius.full, borderWidth: 1 },
    badgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10 },
    emptySectionText: { fontSize: 13, marginBottom: 8 },

    recipeCard: { borderRadius: radius.large, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
    recipeHero: { height: 120, alignItems: 'center', justifyContent: 'center' },
    matchBadge: {
        position: 'absolute', top: 12, right: 12,
        paddingVertical: 5, paddingHorizontal: 10, borderRadius: radius.full, borderWidth: 1,
    },
    matchBadgeText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10 },

    recipeInfo: { padding: 16 },
    recipeName: { fontSize: 18, letterSpacing: -0.5, marginBottom: 6 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
    tag: { paddingVertical: 3, paddingHorizontal: 10, borderWidth: 1, borderRadius: radius.full },
    tagText: { fontFamily: 'DMSans_500Medium', fontSize: 10 },
    recipeMeta: { fontSize: 12 },
    missingText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, marginTop: 6 },

    emptyState: { padding: 40, alignItems: 'center', gap: 12 },
    emptyEmoji: { fontSize: 56 },
    emptyTitle: { fontSize: 22, letterSpacing: -0.5 },
    emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
    addPantryBtn: {
        marginTop: 8, backgroundColor: palette.green,
        paddingVertical: 12, paddingHorizontal: 24, borderRadius: radius.full,
    },
    addPantryBtnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: '#fff' },

    pressed: { opacity: 0.7 },
})
