// Dynamic recipe detail screen — receives `id` param from router, fetches full detail from API
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native"
import { useCallback, useState } from 'react'
import { Feather } from '@expo/vector-icons'
import { palette, radius, useAppColors } from "../constants/colors"
import { getRecipeDetail, saveRecipe, unsaveRecipe } from '../api/recipeApi'
import { useToast } from '../hooks/useToast'
// Themed components
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"
import Toast from '../components/Toast'

// Map emojis to cuisine as thumbnail
const CUISINE_EMOJIS = {
    Italian: '🍝', Asian: '🍛', Western: '🍳', Comfort: '🫕', Breakfast: '🥞',
}

const DIETARY_LABELS = {
    VEGETARIAN: 'Vegetarian', VEGAN: 'Vegan', GLUTEN_FREE: 'Gluten-Free',
    DAIRY_FREE: 'Dairy-Free', NUT_FREE: 'Nut-Free', PESCATARIAN: 'Pescatarian',
    HIGH_PROTEIN: 'High Protein', LOW_CARB: 'Low Carb',
}

const formatQty = (quantity, unit) => {
    if (!quantity) return unit || ''
    const q = Number(quantity)
    const display = q % 1 === 0 ? q : q.toFixed(1)
    return unit ? `${display} ${unit}` : `${display}`
}

const RecipeDetails = () => {
    const { id } = useLocalSearchParams()           // grab recipe ID from expo router
    const c = useAppColors()
    const { toast, showToast } = useToast()
    const [recipe, setRecipe] = useState(null)      // recipe to be loaded
    const [loading, setLoading] = useState(true)    // loading state for recipe
    // Optimistic saved state — initialised from API response, then toggled locally
    const [isSaved, setIsSaved] = useState(false)

    // Map a bg colour for each cuisine
    const CUISINE_BG = {
        Italian: c.green, Asian: c.amber, Western: c.warmGray, Comfort: c.green, Breakfast: c.terracotta
    }

    // Load recipe details and saved flag
    useFocusEffect(useCallback(() => {
        if (!id) return
        const load = async () => {
            try {
                setLoading(true)
                const data = await getRecipeDetail(id)
                setRecipe(data)
                setIsSaved(data.saved ?? false)
            } catch (e) {
                console.error('Failed to load recipe:', e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id]))
    // Toggle save function
    const handleToggleSave = async () => {
        // Optimistic update — flip immediately, revert on error
        const wasSaved = isSaved
        setIsSaved(!wasSaved)
        try {
            if (wasSaved) {
                await unsaveRecipe(id)
                showToast('Recipe unsaved! 🗑️')
            } else {
                await saveRecipe(id)
                showToast('Recipe saved! 🔖')
            }
        } catch (e) {
            setIsSaved(wasSaved) // revert if error
            showToast('Something went wrong')
        }
    }
    // Loading state
    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <View style={[styles.header, { justifyContent: 'flex-start', paddingTop: 52 }]}>
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <Feather name='chevron-left' size={22} color='white' />
                    </Pressable>
                </View>
                <ActivityIndicator style={{ marginTop: 80 }} size='large' color={c.green} />
            </ThemedView>
        )
    }
    // Empty state
    if (!recipe) {
        return (
            <ThemedView style={styles.container}>
                <View style={[styles.header, { justifyContent: 'flex-start', paddingTop: 52 }]}>
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <Feather name='chevron-left' size={22} color='white' />
                    </Pressable>
                </View>
                <View style={{ padding: 24 }}>
                    <ThemedText>Recipe not found.</ThemedText>
                </View>
            </ThemedView>
        )
    }

    const emoji = CUISINE_EMOJIS[recipe.cuisine] || '🍽️'
    const isFullMatch = recipe.totalRequired === 0 || recipe.matchedCount === recipe.totalRequired
    const missing = recipe.totalRequired - recipe.matchedCount

    return (
        <ThemedView style={styles.container}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Pressable
                        style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                        onPress={() => router.back()}>
                        <Feather name='chevron-left' size={22} color='white' />
                    </Pressable>
                    <ThemedText style={{ fontSize: 96 }} serif>{emoji}</ThemedText>
                    <Pressable
                        style={({ pressed }) => [
                            styles.saveBtn,
                            isSaved && styles.saveBtnActive,
                            pressed && styles.pressed,
                        ]}
                        onPress={handleToggleSave}>
                        <ThemedText style={{ fontSize: 18 }}>{isSaved ? '🔖' : '🔖'}</ThemedText>
                    </Pressable>
                </View>

                <View style={styles.body}>
                    {/* Tags row - Cuisine, dietary, match type */}
                    <View style={styles.tagRow}>
                        {recipe.cuisine && (
                            <View style={[styles.tag, { backgroundColor: c.creamDark, borderColor: c.warmGray }]}>
                                <ThemedText style={styles.tagText} subtitle>{recipe.cuisine}</ThemedText>
                            </View>
                        )}
                        {(recipe.dietaryTags || []).map(tag => (
                            <View key={tag} style={[styles.tag, { backgroundColor: c.creamDark, borderColor: c.warmGray }]}>
                                <ThemedText style={styles.tagText} subtitle>
                                    {DIETARY_LABELS[tag] || tag}
                                </ThemedText>
                            </View>
                        ))}
                        <View style={[styles.tag, {
                            backgroundColor: isFullMatch ? c.freshLight : c.amberLight,
                            borderColor: isFullMatch ? c.fresh : c.amber,
                        }]}>
                            <ThemedText style={[styles.tagText, {
                                fontFamily: 'DMSans_600SemiBold',
                                color: isFullMatch ? c.fresh : c.amber,
                            }]}>
                                {isFullMatch ? '✓ Full match' : `+${missing} item${missing === 1 ? '' : 's'}`}
                            </ThemedText>
                        </View>
                    </View>

                    <ThemedText style={styles.recipeTitle} serif>{recipe.name}</ThemedText>

                    {/* Stats row - cook time, servings, $ per serve, calories */}
                    <View style={styles.statsRow}>
                        {[
                            { val: recipe.cookTimeMins ? `${recipe.cookTimeMins}` : '—', lbl: 'MINUTES' },
                            { val: recipe.servings ? `${recipe.servings}` : '—', lbl: 'SERVINGS' },
                            { val: recipe.costPerServe ? `$${Number(recipe.costPerServe).toFixed(2)}` : '—', lbl: 'PER SERVE' },
                            { val: recipe.calories ? `${recipe.calories}` : '—', lbl: 'CALORIES' },
                        ].map(s => (
                            <View key={s.lbl}
                                style={[styles.statCard, { backgroundColor: c.uiBackground, borderColor: c.border }]}>
                                <ThemedText style={styles.statVal} serif>{s.val}</ThemedText>
                                <ThemedText style={styles.statLbl} subtitle>{s.lbl}</ThemedText>
                            </View>
                        ))}
                    </View>

                    {/* Ingredients list */}
                    <ThemedText style={styles.sectionTitle} serif>Ingredients</ThemedText>
                    {(recipe.ingredients || []).map((ing, i) => (
                        <View key={ing.id ?? i} style={[styles.ingrItem, { borderBottomColor: c.border }]}>
                            <View style={styles.ingrItemLeft}>
                                <View style={[
                                    styles.checkCircle,
                                    ing.optional
                                        ? { backgroundColor: c.creamDark }
                                        : ing.inPantry
                                            ? { backgroundColor: c.freshLight }
                                            : [styles.checkMissing, { backgroundColor: c.redLight, borderColor: c.red }]
                                ]}>
                                    <ThemedText style={{ fontSize: 10 }}>
                                        {ing.optional ? '○' : ing.inPantry ? '✓' : '✗'}
                                    </ThemedText>
                                </View>
                                <ThemedText style={[
                                    styles.ingrName,
                                    !ing.optional && !ing.inPantry && { color: c.red }
                                ]}>
                                    {ing.ingredientName}
                                    {ing.optional && (
                                        <ThemedText style={styles.optionalLabel} subtitle> (optional)</ThemedText>
                                    )}
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.ingrQty} subtitle>
                                {formatQty(ing.quantity, ing.unit)}
                            </ThemedText>
                        </View>
                    ))}

                    {/* Instructions */}
                    <ThemedText style={styles.sectionTitle} serif>Instructions</ThemedText>
                    {(recipe.steps || []).map((step, i) => (
                        <View key={i} style={styles.stepItem}>
                            <View style={styles.stepNum}>
                                <ThemedText style={styles.stepNumText}>{i + 1}</ThemedText>
                            </View>
                            <ThemedText style={styles.stepText}>{step}</ThemedText>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating 'I cooked this' container */}
            <View style={[styles.floatingContainer, { bottom: 52 }]}>
                <Pressable
                    style={({ pressed }) => [styles.cookBtn, pressed && styles.pressed]}
                    onPress={() => showToast('🍳 Cooking history coming in Sprint 4!')}>
                    <ThemedText style={styles.cookBtnText}>I cooked this</ThemedText>
                </Pressable>
            </View>

            <Toast message={toast.message} visible={toast.visible} />
        </ThemedView>
    )
}
export default RecipeDetails

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        backgroundColor: palette.green,
        height: 260,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 24, paddingTop: 52, paddingBottom: 28,
    },
    backBtn: {
        position: 'absolute', left: 20, top: 52,
        borderWidth: 0.6,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: radius.medium,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center',
    },
    saveBtn: {
        position: 'absolute', right: 20, top: 52,
        borderWidth: 0.6,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: radius.medium,
        height: 44, width: 44,
        justifyContent: 'center', alignItems: 'center',
    },
    saveBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.30)',
        borderColor: 'rgba(255,255,255,0.5)',
    },

    body: { padding: 24, gap: 12 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
    tag: { paddingVertical: 3, paddingHorizontal: 10, borderWidth: 1, borderRadius: radius.full },
    tagText: { fontSize: 10 },

    recipeTitle: { fontSize: 24, letterSpacing: -1, lineHeight: 36 },

    statsRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    statCard: { flex: 1, borderWidth: 1, borderRadius: radius.small, padding: 10, alignItems: 'center' },
    statVal: { fontSize: 14 },
    statLbl: { fontFamily: 'DMSans_500Medium', fontSize: 9, letterSpacing: -0.5, marginTop: 2, textAlign: 'center' },

    sectionTitle: { fontSize: 18, letterSpacing: -0.5, marginTop: 20, marginBottom: 12 },

    ingrItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        paddingVertical: 10, borderBottomWidth: 1,
    },
    ingrItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    checkCircle: { width: 22, height: 22, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
    checkMissing: { borderWidth: 1.5, borderStyle: 'dashed' },
    ingrName: { flex: 1, fontSize: 14 },
    optionalLabel: { fontSize: 11 },
    ingrQty: { fontSize: 12 },

    stepItem: { flexDirection: 'row', gap: 14 },
    stepNum: {
        width: 28, height: 28,
        backgroundColor: palette.green, borderRadius: 8,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
    },
    stepNumText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#fff' },
    stepText: { flex: 1, fontSize: 14, lineHeight: 22 },

    floatingContainer: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
    cookBtn: {
        backgroundColor: palette.terracotta,
        borderRadius: radius.full, paddingVertical: 16, paddingHorizontal: 32,
        shadowColor: palette.terracotta, shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
    },
    cookBtnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 16, color: '#fff' },

    pressed: { opacity: 0.7 },
})
