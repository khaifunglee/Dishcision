// Recipes tab — live data from /recipes, sorted by pantry match, with client-side filters
import { View, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Alert } from "react-native"
import { router, useFocusEffect } from "expo-router"
import { palette, radius, useAppColors } from "../../constants/colors"
import { useMemo, useState, useCallback } from "react"
import { useOnboarding } from "../../context/OnboardingContext"
import { useToast } from "../../hooks/useToast"
import { getRecipes, getSavedRecipes, saveRecipe, unsaveRecipe } from "../../api/recipeApi"
// Themed components
import OnboardingOverlay from "../../components/OnboardingOverlay"
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import SwipeableRecipeItem from "../../components/SwipeableRecipeItem"
import Toast from "../../components/Toast"

// Maps cuisine to a display emoji for the thumbnail
const CUISINE_EMOJIS = {
    Italian: '🍝', Asian: '🍛', Western: '🍳', Comfort: '🫕', Breakfast: '🥞',
}
// Chips for each filterable category, value=null means no filters
const CUISINE_CHIPS = [
    { key: 'All cuisines', label: null },
    { key: '🍝 Italian', label: 'Italian' },
    { key: '🍛 Asian', label: 'Asian' },
    { key: '🍳 Western', label: 'Western' },
    { key: '🫕 Comfort', label: 'Comfort' },
    { key: '🥞 Breakfast', label: 'Breakfast' },
]

const TIME_CHIPS = [
    { key: '⏱ Any time', label: null },
    { key: '≤15 min', label: 15 },
    { key: '≤30 min', label: 30 },
]

const DIETARY_CHIPS = [
    { key: 'All diets', label: null },
    { key: '🌿 Vegetarian', label: 'VEGETARIAN' },
    { key: '🌱 Vegan', label: 'VEGAN' },
    { key: '🌾 Gluten-Free', label: 'GLUTEN_FREE' },
]

const Recipes = () => {
    const c = useAppColors()
    const { shouldOnboard, completeOnboarding } = useOnboarding()
    const [showOverlay, setShowOverlay] = useState(false)
    const { toast, showToast } = useToast()

    const [recipes, setRecipes] = useState([])                  // recipes to be loaded
    const [loading, setLoading] = useState(true)                // loading recipes state
    const [searchQuery, setSearchQuery] = useState('')          // search bar string
    const [cuisineFilter, setCuisineFilter] = useState(null)    // cuisine filter value
    const [timeFilter, setTimeFilter] = useState(null)          // cook time filter value
    const [dietaryFilter, setDietaryFilter] = useState(null)    // diet tags filter value
    const [showSavedOnly, setShowSavedOnly] = useState(false)   // saved filter

    // Map a bg colour for each cuisine
    const CUISINE_BG = {
        Italian: c.greenLight, Asian: c.amberLight, Western: c.creamDark, Comfort: c.greenLight, Breakfast: c.terracottaLight
    }
    const themed = useMemo(() => ({
        card: { backgroundColor: c.uiBackground, borderColor: c.border },
        signatureColor: { color: c.green },
        activeChip: { backgroundColor: c.green, borderColor: c.green },
    }), [c])

    // Show onboarding overlay on first use
    useFocusEffect(useCallback(() => {
        if (shouldOnboard) setShowOverlay(true)
    }, [shouldOnboard]))

    // Fetch all recipes on focus, filtering done client-side
    useFocusEffect(useCallback(() => {
        const load = async () => {
            try {
                setLoading(true)
                // Fetch from /recipes/saved instead of /recipes if showSavedOnly = true
                const data = showSavedOnly ? await getSavedRecipes() : await getRecipes()
                setRecipes(Array.isArray(data) ? data : [])
            } catch (e) {
                console.error('Failed to load recipes:', e)
                Alert.alert('Error', 'Could not load recipes. Please try again.')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [showSavedOnly]))
    // Functions to skip or finish onboarding
    const handleFinish = async () => {
        setShowOverlay(false)
        await completeOnboarding()
        router.replace('/home')
    }
    const handleSkip = async () => {
        setShowOverlay(false)
        await completeOnboarding()
    }

    // Function to toggle save/unsave recipe
    const handleToggleSaved = async (recipe) => {
        const wasSaved = recipe.saved
        // Optimistic update in list
        setRecipes(prev => prev.map(r =>
            r.id === recipe.id ? { ...r, saved: !wasSaved } : r
        ))
        try {
            // If saved recipe = toggle unsave recipe
            if (wasSaved) {
                await unsaveRecipe(recipe.id)
                showToast('Recipe unsaved! 🗑️')
                // If in saved-only view, remove from list
                if (showSavedOnly) {
                    setRecipes(prev => prev.filter(r => r.id !== recipe.id))
                }
            // Otherwise toggle save recipe
            } else {
                await saveRecipe(recipe.id)
                showToast('Recipe saved! 🔖')
            }
        } catch (e) {
            // Revert optimistic update if error
            setRecipes(prev => prev.map(r =>
                r.id === recipe.id ? { ...r, saved: wasSaved } : r
            ))
            showToast('Something went wrong')
        }
    }

    // Build the display object for SwipeableRecipeItem
    // Meta: cuisine, time to cook, $ per serve
    const toDisplayRecipe = useCallback((r) => {
        const isFullMatch = r.totalRequired === 0 || r.matchedCount === r.totalRequired
        const missing = r.totalRequired - r.matchedCount
        return {
            id: r.id,
            name: r.name,
            emoji: CUISINE_EMOJIS[r.cuisine] || '🍽️',
            bg: CUISINE_BG[r.cuisine] || c.greenLight,
            meta: [r.cuisine, r.cookTimeMins && `${r.cookTimeMins} min`,
                   r.costPerServe && `~$${Number(r.costPerServe).toFixed(2)}/serve`]
                  .filter(Boolean).join(' · '),
            match: isFullMatch ? '100%' : `+${missing} item${missing === 1 ? '' : 's'}`,
            matchType: isFullMatch ? 'full' : 'partial',
            saved: r.saved,
        }
    }, [c])

    // Client-side filter + sort by match % function
    const sorted = useMemo(() => {
        let filtered = recipes
        // 1. Match by text on search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(q) ||
                (r.cuisine && r.cuisine.toLowerCase().includes(q)))
        }
        // 2. Match by cuisine, time, dietary filters if chips are active
        // Cuisine / time / dietary filters only apply when not in saved-only view
        if (!showSavedOnly) {
            if (cuisineFilter) filtered = filtered.filter(r => r.cuisine === cuisineFilter)
            if (timeFilter)    filtered = filtered.filter(r => r.cookTimeMins <= timeFilter)
            if (dietaryFilter) filtered = filtered.filter(r =>
                r.dietaryTags && r.dietaryTags.includes(dietaryFilter))
        }
        return [...filtered].sort((a, b) => {
            const pctA = a.totalRequired > 0 ? a.matchedCount / a.totalRequired : 1
            const pctB = b.totalRequired > 0 ? b.matchedCount / b.totalRequired : 1
            if (pctB !== pctA) return pctB - pctA
            return (a.cookTimeMins || 0) - (b.cookTimeMins || 0)
        })
    }, [recipes, searchQuery, cuisineFilter, timeFilter, dietaryFilter, showSavedOnly])

    const handleSavedChipPress = () => {
        setShowSavedOnly(prev => !prev)
        // Reset other filters when switching to saved view
        // Design choice: saved filter disables all other filters
        if (!showSavedOnly) {
            setCuisineFilter(null)
            setTimeFilter(null)
            setDietaryFilter(null)
        }
    }

    return (
        <ThemedView style={styles.container} safe>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: 16 }]}>
                    <ThemedText style={styles.title} serif>Recipes</ThemedText>
                    <Pressable
                        style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
                        onPress={() => showToast('User recipes coming soon!')}>
                        <ThemedText style={styles.addBtnText}>+</ThemedText>
                    </Pressable>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchBar, themed.card]}>
                    <ThemedText style={{ fontSize: 16 }}>🔍</ThemedText>
                    <TextInput
                        placeholder={`Search ${recipes.length} recipes...`}
                        placeholderTextColor='#D2CEC6'
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Cuisine filter chips + Saved chip */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}>
                    {/* Saved chip */}
                    <Pressable
                        style={[styles.filterChip, themed.card, showSavedOnly && themed.activeChip]}
                        onPress={handleSavedChipPress}>
                        <ThemedText
                            style={[styles.filterChipText, showSavedOnly && styles.filterChipTextActive]}
                            subtitle>
                            🔖 Saved
                        </ThemedText>
                    </Pressable>
                    {/* Cuisine chips */}
                    {!showSavedOnly && CUISINE_CHIPS.map(chip => (
                        <Pressable key={chip.key}
                            style={[styles.filterChip, themed.card, cuisineFilter === chip.label && themed.activeChip]}
                            onPress={() => setCuisineFilter(chip.label)}>
                            <ThemedText style={[styles.filterChipText, cuisineFilter === chip.label && styles.filterChipTextActive]}
                                subtitle>{chip.key}</ThemedText>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Time + Dietary chips */}
                {!showSavedOnly && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[styles.filterRow, { paddingTop: 0, paddingBottom: 8 }]}>
                        {TIME_CHIPS.map(chip => (
                            <Pressable key={chip.key}
                                style={[styles.filterChip, themed.card, timeFilter === chip.label && themed.activeChip]}
                                onPress={() => setTimeFilter(chip.label)}>
                                <ThemedText style={[styles.filterChipText, timeFilter === chip.label && styles.filterChipTextActive]}
                                    subtitle>{chip.key}</ThemedText>
                            </Pressable>
                        ))}
                        <View style={styles.filterDivider} />
                        {DIETARY_CHIPS.map(chip => (
                            <Pressable key={chip.key}
                                style={[styles.filterChip, themed.card, dietaryFilter === chip.label && themed.activeChip]}
                                onPress={() => setDietaryFilter(chip.label)}>
                                <ThemedText style={[styles.filterChipText, dietaryFilter === chip.label && styles.filterChipTextActive]}
                                    subtitle>{chip.key}</ThemedText>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}

                {/* Sort label */}
                <View style={styles.sortRow}>
                    <ThemedText style={styles.sortLabel} subtitle>
                        {showSavedOnly ? 'Showing: ' : 'Sorted by: '}
                    </ThemedText>
                    <ThemedText style={[styles.sortValue, themed.signatureColor]}>
                        {showSavedOnly ? 'Saved recipes' : 'Best Match to Pantry'}
                    </ThemedText>
                    {!loading && (
                        <ThemedText style={[styles.sortLabel, { marginLeft: 8 }]} subtitle>
                            · {sorted.length} recipe{sorted.length === 1 ? '' : 's'}
                        </ThemedText>
                    )}
                </View>

                {/* Recipe list */}
                {loading ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={c.green} />
                ) : sorted.length === 0 ? (
                    <View style={styles.emptyState}>
                        <ThemedText style={styles.emptyEmoji}>
                            {showSavedOnly ? '🔖' : '🔍'}
                        </ThemedText>
                        <ThemedText style={styles.emptyText} subtitle>
                            {showSavedOnly
                                ? 'No saved recipes yet — tap 🔖 on any recipe to save it'
                                : 'No recipes match your filters'}
                        </ThemedText>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {sorted.map(recipe => (
                            <SwipeableRecipeItem
                                key={recipe.id}
                                recipe={toDisplayRecipe(recipe)}
                                onPress={() => router.push({ pathname: '/recipe-detail', params: { id: recipe.id } })}
                                onSave={() => handleToggleSaved(recipe)}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <OnboardingOverlay
                visible={showOverlay}
                step={3} total={3}
                body='Browse recipes sorted by your best pantry match. Tap 🔖 to save favourites!'
                onNext={handleFinish}
                onSkip={handleSkip}
            />
            <Toast message={toast.message} visible={toast.visible} />
        </ThemedView>
    )
}
export default Recipes

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 24, paddingBottom: 16,
    },
    title: { fontSize: 32, letterSpacing: -1 },
    addBtn: {
        width: 40, height: 40,
        borderRadius: radius.small, backgroundColor: palette.green,
        alignItems: 'center', justifyContent: 'center',
    },
    addBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

    searchBar: {
        flexDirection: 'row', alignItems: 'center', gap: 10,
        marginHorizontal: 24, marginBottom: 12,
        borderWidth: 1.5, borderRadius: 14, padding: 12,
    },
    searchInput: { flex: 1, fontSize: 14, fontFamily: 'DMSans_400Regular' },

    filterRow: { paddingHorizontal: 24, paddingBottom: 12, gap: 8 },
    filterChip: {
        paddingVertical: 6, paddingHorizontal: 14,
        borderRadius: radius.full, borderWidth: 1.5,
        alignItems: 'center', justifyContent: 'center',
    },
    filterChipText: { fontFamily: 'DMSans_500Medium', fontSize: 12 },
    filterChipTextActive: { color: '#fff' },
    filterDivider: { width: 1, backgroundColor: palette.beige, marginVertical: 4 },

    sortRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 8, alignItems: 'center' },
    sortLabel: { fontSize: 12 },
    sortValue: { fontFamily: 'DMSans_600SemiBold', fontSize: 12 },

    list: { paddingHorizontal: 24, gap: 12 },

    emptyState: { alignItems: 'center', paddingTop: 60, gap: 8, paddingHorizontal: 40 },
    emptyEmoji: { fontSize: 40 },
    emptyText: { fontSize: 14, textAlign: 'center' },

    pressed: { opacity: 0.7 },
})
