// This page serves as the home dashboard page (accessible by bottom nav dashboard) for the app
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import { Feather } from '@expo/vector-icons'
import { palette, radius, shadow } from "../constants/colors"
// Themed components
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"
import Spacer from '../components/Spacer'
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
        <ThemedView style={styles.container} safe>
            {/* Use safe=true for safeAreaView */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: 16, }]}>
                    <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                        onPress={() => router.back()}>
                        <Feather name={'chevron-left'} size={22} color={'black'} />
                    </Pressable>
                    <View>
                        <ThemedText style={styles.headerTitle} serif >Today's Dishcisions 🍽️</ThemedText>
                        <ThemedText style={styles.headerSub}>Based on your 12 pantry items</ThemedText>
                    </View>
                    <View style={styles.avatar}>
                        <ThemedText style={styles.avatarText} serif>A</ThemedText>
                    </View>
                </View>

                {/* Expiry Alert */}
                <Pressable style={({ pressed }) => [styles.expiryAlert, pressed && styles.pressed]}
                    onPress={() => router.push('/pantry')}>
                    <View style={styles.expiryIcon}>
                        <ThemedText style={{ fontSize: 16 }}>⏰</ThemedText>
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={styles.expiryTitle}>3 items expiring soon</ThemedText>
                        <ThemedText style={styles.expirySub}>Spinach, Chicken, Tomatoes · Tap to View</ThemedText>
                    </View>
                    <ThemedText style={styles.expiryArrow}>›</ThemedText>
                </Pressable>

                {/* Tonight's Dishcisions Card */}
                <Pressable style={({ pressed }) => [styles.headerCard, pressed && styles.pressed]}
                    onPress={() => router.push('/suggestions')}>
                    <View>
                        <ThemedText style={styles.cardEyebrow}>◊ YOUR PANTRY · 12 ITEMS</ThemedText>
                        <ThemedText style={styles.cardTitle} serif > Tonight's{'\n'}
                            <ThemedText style={styles.cardTitleAccent} serif>Dishcisions</ThemedText>
                        </ThemedText>
                        <ThemedText style={styles.cardSub}>5 recipes you can cook right now</ThemedText>
                    </View>
                    <View style={styles.cardCta}>
                        <ThemedText style={styles.cardCtaText}>See what's cooking ›</ThemedText>
                    </View>
                </Pressable>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[
                        { emoji: '🥦', value: '12', label: 'Pantry items' },
                        { emoji: '📖', value: '38', label: 'Recipes' },
                        { emoji: '♻️', value: '$24', label: 'Saved this week' },
                    ].map((stat) => (
                        <View key={stat.label} style={styles.statCard}>
                            <ThemedText style={styles.statIcon}>{stat.emoji}</ThemedText>
                            <ThemedText style={styles.statValue} serif >{stat.value}</ThemedText>
                            <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
                        </View>
                    ))}
                </View>

                {/* Quick Add */}
                <Pressable style={({ pressed }) => [styles.quickAdd, pressed && styles.pressed]}>
                    <View style={styles.quickAddIcon}>
                        <ThemedText style={{ fontSize: 18, color: palette.green }}>+</ThemedText>
                    </View>
                    <ThemedText style={styles.quickAddText}>
                        <ThemedText style={styles.quickAddBold}>Quick-add </ThemedText>
                        an ingredient to your pantry
                    </ThemedText>
                    <ThemedText style={{ color: palette.warmGray, fontSize: 18 }}>›</ThemedText>
                </Pressable>

            </ScrollView>

        </ThemedView>
    )
}
export default Suggestions

const styles = StyleSheet.create({
    container: { flex: 1, },
    scroll: { paddingHorizontal: 24, gap: 12 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    greetingSub: { fontSize: 13, },
    greetingMain: { fontSize: 24, letterSpacing: -0.5, },
    avatar: {
        width: 44, height: 44,
        backgroundColor: palette.green,
        borderRadius: radius.small,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { fontSize: 18, color: '#fff' },

    expiryAlert: {
        backgroundColor: palette.redLight,
        borderWidth: 1, borderColor: '#FABEBE',
        borderRadius: radius.small,
        padding: 16,
        flexDirection: 'row', alignItems: 'center', gap: 16,
    },
    expiryIcon: {
        width: 36, height: 36,
        backgroundColor: palette.red,
        borderRadius: radius.small,
        alignItems: 'center', justifyContent: 'center',
    },
    expiryTitle: { fontFamily: 'DMSans_600SemiBold', fontSize: 14, color: palette.red },
    expirySub: { fontSize: 10, color: 'rgba(0,0,0,0.45)', marginTop: 2 },
    expiryArrow: { fontSize: 16, color: palette.red, opacity: 0.6 },

    headerCard: {
        backgroundColor: palette.green,
        borderRadius: radius.large,
        padding: 24,
        minHeight: 180,
        justifyContent: 'space-between',
        ...shadow.large,
    },
    cardEyebrow: { fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.5)', },
    cardTitle: { fontSize: 28, color: '#fff', letterSpacing: -1, marginTop: 8, lineHeight: 32 },
    cardTitleAccent: { fontFamily: 'Fraunces_400Regular_Italic', color: '#F5A675' },
    cardSub: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 },
    cardCta: {
        backgroundColor: palette.terracotta,
        borderRadius: radius.full,
        paddingVertical: 10, paddingHorizontal: 16,
        alignSelf: 'flex-start', marginTop: 16,
    },
    cardCtaText: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: '#fff' },

    statsRow: { flexDirection: 'row', gap: 12 },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: radius.small,
        borderWidth: 1, borderColor: palette.beige,
        padding: 12, //gap: 4
    },
    statIcon: { fontSize: 22, marginBottom: 4 },
    statValue: { fontSize: 24 },
    statLabel: { fontSize: 10, color: 'rgba(0,0,0,0.5)', },

    quickAdd: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6,
        backgroundColor: '#fff',
        borderWidth: 1.5, borderColor: palette.beige, borderStyle: 'dashed',
        borderRadius: radius.small, padding: 12
    },
    quickAddIcon: {
        width: 32, height: 32,
        backgroundColor: palette.greenLight,
        borderRadius: 10,
        alignItems: 'center', justifyContent: 'center',
    },
    quickAddText: { flex: 1, fontSize: 14, color: 'rgba(0,0,0,0.5)', },
    quickAddBold: { fontFamily: 'DMSans_600SemiBold', color: palette.green },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
    sectionTitle: { fontSize: 18 },
    sectionAction: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: palette.green, },

    hScroll: { gap: 16, paddingVertical: 4 },
    recipeCardMini: {
        width: 140,
        backgroundColor: '#fff',
        borderRadius: radius.small,
        borderWidth: 1, borderColor: palette.beige,
        overflow: 'hidden',
    },
    recipeCardImg: { height: 90, alignItems: 'center', justifyContent: 'center', },
    recipeCardName: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, lineHeight: 18 },
    recipeCardMeta: { fontSize: 9, color: 'rgba(0,0,0,0.5)', marginTop: 4 },

    pressed: { opacity: 0.7 }
})