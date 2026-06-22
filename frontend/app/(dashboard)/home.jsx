// Home dashboard — add or check for expiring ingredients, look at suggested/saved recipes, etc.
import { router, useFocusEffect } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View, Text } from "react-native"
import { palette, radius, shadow, useAppColors } from "../../constants/colors"
import { useCallback, useMemo, useState } from 'react'
import { useOnboarding } from '../../context/OnboardingContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../hooks/useToast'
import { getAll } from '../../api/pantryApi'
import { getSuggestions, getSavedRecipes } from '../../api/recipeApi'
// Themed components
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import Spacer from '../../components/Spacer'
import OnboardingOverlay from '../../components/OnboardingOverlay'
import Toast from '../../components/Toast'
import AddIngredientSheet from '../../components/AddIngredientSheet'

// Maps cuisine to a background colour for saved recipe cards
const CUISINE_BG_KEYS = {
    Italian: 'freshLight', Asian: 'amberLight', Western: 'creamDark',
    Comfort: 'greenLight', Breakfast: 'terracottaLight',
}
const CUISINE_EMOJIS = {
    Italian: '🍝', Asian: '🍛', Western: '🍳', Comfort: '🫕', Breakfast: '🥞',
}

const Home = () => {
    const c = useAppColors()
    const { shouldOnboard, completeOnboarding } = useOnboarding()
    const { user } = useAuth()
    const [showOverlay, setShowOverlay] = useState(false)
    const [items, setItems] = useState([])                          // list of pantry items
    const [sheetVisible, setSheetVisible] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [fullMatchCount, setFullMatchCount] = useState(null)      // # of full match recipes
    const [savedRecipes, setSavedRecipes] = useState([])            // list of saved recipes
    const { toast, showToast } = useToast()

    const themed = useMemo(() => ({
        card: { backgroundColor: c.uiBackground, borderColor: c.border },
    }), [c])

    // User initial for avatar
    const userInitial = useMemo(() => {
        if (!user?.name) return '?'
        return user.name.trim().charAt(0).toUpperCase()
    }, [user])

    useFocusEffect(useCallback(() => {
        if (shouldOnboard) setShowOverlay(true)
    }, [shouldOnboard]))

    // Fetch pantry, suggestions, and saved recipes on every focus
    useFocusEffect(useCallback(() => {
        const load = async () => {
            try {
                const [pantryData, suggestionsData, savedData] = await Promise.all([
                    getAll(),
                    getSuggestions(),
                    getSavedRecipes(),
                ])
                setItems(pantryData)
                setFullMatchCount(suggestionsData.fullMatch?.length ?? 0)
                setSavedRecipes(Array.isArray(savedData) ? savedData : [])
            } catch (e) {
                console.error('Home load error:', e)
            }
        }
        load()
    }, []))

    // Expiry status calculate helpers
    function getExpiryStatus(expiryDate) {
        if (!expiryDate) return 'fresh'
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const expiry = new Date(expiryDate)
        expiry.setHours(0, 0, 0, 0)
        const diff = Math.ceil((expiry - today) / 86400000)
        if (diff <= 3) return 'expiring'
        return 'fresh'
    }
    // Get expiring pantry items
    const expiringItems = useMemo(() => {
        return items.filter(i => getExpiryStatus(i.expiryDate) === 'expiring')
    }, [items])

    // Handle next/skip steps in onboarding overlay
    const handleNext = () => { setShowOverlay(false); router.push('/pantry') }
    const handleSkip = async () => { setShowOverlay(false); await completeOnboarding() }

    // Function for adding ingredient to pantry
    const handleSaved = (savedItem, wasEditing) => {
        if (wasEditing) {
            setItems(prev => prev.map(i => i.id === savedItem.id ? savedItem : i))
        } else {
            setItems(prev => [...prev, savedItem])
            showToast('✓ Ingredient added to pantry!')
        }
    }
    // Open add ingredient sheet
    const openAdd = () => { setEditingItem(null); setSheetVisible(true) }

    const dishcisionSubtitle = useMemo(() => {
        if (items.length === 0) return 'Add ingredients to see tonight\'s suggestions'
        if (fullMatchCount === null) return 'Loading...'
        if (fullMatchCount === 0) return 'Need a few more ingredients — check "Almost There"'
        return `${fullMatchCount} recipe${fullMatchCount === 1 ? '' : 's'} you can cook right now`
    }, [items.length, fullMatchCount])

    return (
        <ThemedView style={styles.container} safe>
            <ScrollView
                contentContainerStyle={[styles.scroll, { paddingTop: 16 }]}
                showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <ThemedText style={styles.greetingSub} subtitle>Good morning ☀️</ThemedText>
                        <ThemedText style={styles.greetingMain} serif>Make a Dishcision</ThemedText>
                    </View>
                    {/* Avatar */}
                    <Pressable
                        style={styles.avatar}
                        onPress={() => router.push('/(dashboard)/profile')}>
                        <ThemedText style={styles.avatarText} serif>{userInitial}</ThemedText>
                    </Pressable>
                </View>

                {/* Expiry Alert */}
                <Pressable
                    style={({ pressed }) => [
                        styles.expiryAlert,
                        expiringItems.length > 0
                            ? { backgroundColor: c.redLight, borderColor: c.red }
                            : { backgroundColor: c.freshLight, borderColor: c.fresh },
                        pressed && styles.pressed
                    ]}
                    onPress={() => router.push('/pantry')}>
                    <View style={[styles.expiryIcon, { backgroundColor: expiringItems.length > 0 ? c.red : c.fresh }]}>
                        <ThemedText style={{ fontSize: 16 }}>{expiringItems.length > 0 ? '⏰' : '👌'}</ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={[styles.expiryTitle, { color: expiringItems.length > 0 ? c.red : c.fresh }]}>
                            {expiringItems.length > 0 ? `${expiringItems.length} items expiring soon` : 'All Good'}
                        </ThemedText>
                        <ThemedText style={styles.expirySub} subtitle>
                            {expiringItems.length > 0
                                ? `${expiringItems.slice(0, 3).map(i => i.ingredientName).join(', ')} · Tap to View`
                                : 'All pantry items are fresh · Tap to View'}
                        </ThemedText>
                    </View>
                    <ThemedText style={[styles.expiryArrow, { color: expiringItems.length > 0 ? c.red : c.fresh }]}>›</ThemedText>
                </Pressable>

                {/* Tonight's Dishcisions Card */}
                <Pressable
                    style={({ pressed }) => [styles.headerCard, pressed && styles.pressed]}
                    onPress={() => items.length > 0
                        ? router.push('/suggestions')
                        : router.push('/pantry')}>
                    <View>
                        <ThemedText style={styles.cardEyebrow} subtitle>
                            ◊ YOUR PANTRY · {items.length} ITEM{items.length === 1 ? '' : 'S'}
                        </ThemedText>
                        <ThemedText style={styles.cardTitle} serif>
                            {' '}Tonight's{'\n'}
                            <ThemedText style={styles.cardTitleAccent} serif>Dishcisions</ThemedText>
                        </ThemedText>
                        <ThemedText style={styles.cardSub} subtitle>{dishcisionSubtitle}</ThemedText>
                    </View>
                    <View style={styles.cardCta}>
                        <ThemedText style={styles.cardCtaText}>
                            {items.length === 0 ? 'Add ingredients →' : 'See what\'s cooking ›'}
                        </ThemedText>
                    </View>
                </Pressable>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[
                        { emoji: '🥦', value: `${items.length}`, label: 'Pantry items' },
                        { emoji: '📖', value: '30', label: 'Recipes' },
                        { emoji: '🔖', value: `${savedRecipes.length}`, label: 'Saved Recipes' },
                    ].map(stat => (
                        <View key={stat.label} style={[styles.statCard, themed.card]}>
                            <ThemedText style={styles.statIcon}>{stat.emoji}</ThemedText>
                            <Text style={[styles.statValue, { color: c.text }]}>{stat.value}</Text>
                            <Text style={[styles.statLabel, { color: c.textSoft }]}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Quick Add */}
                <Pressable
                    style={({ pressed }) => [styles.quickAdd, themed.card, pressed && styles.pressed]}
                    onPress={openAdd}>
                    <View style={[styles.quickAddIcon, { backgroundColor: c.freshLight }]}>
                        <ThemedText style={{ fontSize: 18, color: c.fresh }}>+</ThemedText>
                    </View>
                    <ThemedText style={styles.quickAddText} subtitle>
                        <ThemedText style={[styles.quickAddBold, { color: c.fresh }]}>Quick-add </ThemedText>
                        an ingredient to your pantry
                    </ThemedText>
                    <ThemedText style={{ fontSize: 18 }} subtitle>›</ThemedText>
                </Pressable>

                {/* Saved Recipes section */}
                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle} serif>Saved Recipes</ThemedText>
                    <Pressable onPress={() => router.push({ pathname: '/(dashboard)/recipes', params: { saved: '1' } })}>
                        <ThemedText style={[styles.sectionAction, { color: c.green }]}>See All</ThemedText>
                    </Pressable>
                </View>

                {savedRecipes.length === 0 ? (
                    /* Empty state */
                    <Pressable
                        style={({ pressed }) => [styles.savedEmptyCard, themed.card, pressed && styles.pressed]}
                        onPress={() => router.push('/(dashboard)/recipes')}>
                        <ThemedText style={styles.savedEmptyEmoji}>🔖</ThemedText>
                        <ThemedText style={styles.savedEmptyText} subtitle>
                            Save recipes to see them here!
                        </ThemedText>
                        <ThemedText style={[styles.savedEmptyCta, { color: c.green }]}>
                            Browse Recipes →
                        </ThemedText>
                    </Pressable>
                ) : (
                    /* Saved Recipes list */
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.hScroll}>
                        {savedRecipes.map(recipe => {
                            const bgKey = CUISINE_BG_KEYS[recipe.cuisine] || 'greenLight'
                            const emoji = CUISINE_EMOJIS[recipe.cuisine] || '🍽️'
                            const cookInfo = recipe.cookTimeMins ? `${recipe.cookTimeMins} min` : null
                            const meta = [recipe.cuisine, cookInfo].filter(Boolean).join(' · ')
                            return (
                                <Pressable
                                    key={recipe.id}
                                    style={({ pressed }) => [styles.recipeCardMini, themed.card, pressed && styles.pressed]}
                                    onPress={() => router.push({ pathname: '/recipe-detail', params: { id: recipe.id } })}>
                                    <View style={[styles.recipeCardImg, { backgroundColor: c[bgKey] }]}>
                                        <ThemedText style={{ fontSize: 36 }}>{emoji}</ThemedText>
                                    </View>
                                    <View style={{ padding: 10 }}>
                                        <ThemedText style={styles.recipeCardName}>{recipe.name}</ThemedText>
                                        <ThemedText style={styles.recipeCardMeta} subtitle>⏱ {meta}</ThemedText>
                                    </View>
                                </Pressable>
                            )
                        })}
                    </ScrollView>
                )}

                <Spacer height={16} />
            </ScrollView>

            <OnboardingOverlay
                visible={showOverlay}
                step={1} total={3}
                body='This is your Home screen. See what you can cook tonight and check for expiring items at a glance.'
                onNext={handleNext}
                onSkip={handleSkip}
            />
            <Toast message={toast.message} visible={toast.visible} />
            <AddIngredientSheet
                visible={sheetVisible}
                onClose={() => setSheetVisible(false)}
                onSaved={handleSaved}
            />
        </ThemedView>
    )
}
export default Home

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { paddingHorizontal: 24, gap: 12 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    greetingSub: { fontSize: 13 },
    greetingMain: { fontSize: 24, letterSpacing: -0.5 },
    avatar: {
        width: 44, height: 44, backgroundColor: palette.green,
        borderRadius: radius.small, alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 18, color: '#fff' },

    expiryAlert: { borderWidth: 1, borderRadius: radius.small, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
    expiryIcon: { width: 36, height: 36, borderRadius: radius.small, alignItems: 'center', justifyContent: 'center' },
    expiryTitle: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: palette.red },
    expirySub: { fontSize: 10, marginTop: 2 },
    expiryArrow: { fontSize: 16, opacity: 0.6 },

    headerCard: {
        backgroundColor: palette.green, borderRadius: radius.large, padding: 24, minHeight: 180,
        justifyContent: 'space-between', ...shadow.large,
    },
    cardEyebrow: { fontFamily: 'DMSans_600SemiBold', fontSize: 11 },
    cardTitle: { fontSize: 28, color: '#fff', letterSpacing: -1, marginTop: 8, lineHeight: 32 },
    cardTitleAccent: { fontFamily: 'Fraunces_400Regular_Italic', color: '#F5A675' },
    cardSub: { fontSize: 13, marginTop: 4 },
    cardCta: {
        backgroundColor: palette.terracotta, borderRadius: radius.full,
        paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start', marginTop: 16,
    },
    cardCtaText: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#fff' },

    statsRow: { flexDirection: 'row', gap: 12 },
    statCard: { flex: 1, borderRadius: radius.small, borderWidth: 1, borderColor: palette.beige, padding: 12 },
    statIcon: { fontSize: 22, marginBottom: 4 },
    statValue: { fontSize: 24, fontFamily: 'Fraunces_600SemiBold' },
    statLabel: { fontSize: 10, fontFamily: 'DMSans_400Regular' },

    quickAdd: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6,
        borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius.small, padding: 12,
    },
    quickAddIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    quickAddText: { flex: 1, fontSize: 14 },
    quickAddBold: { fontFamily: 'DMSans_600SemiBold' },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
    sectionTitle: { fontSize: 18 },
    sectionAction: { fontFamily: 'DMSans_600SemiBold', fontSize: 12 },

    savedEmptyCard: {
        borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius.small,
        padding: 24, alignItems: 'center', gap: 8,
    },
    savedEmptyEmoji: { fontSize: 32 },
    savedEmptyText: { fontSize: 13, textAlign: 'center' },
    savedEmptyCta: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, marginTop: 4 },

    hScroll: { gap: 16, paddingVertical: 4 },
    recipeCardMini: { width: 140, borderRadius: radius.small, borderWidth: 1, overflow: 'hidden' },
    recipeCardImg: { height: 90, alignItems: 'center', justifyContent: 'center' },
    recipeCardName: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, lineHeight: 18 },
    recipeCardMeta: { fontSize: 9, marginTop: 4 },

    pressed: { opacity: 0.7 },
})
