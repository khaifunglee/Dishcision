// This page serves as the home dashboard page (accessible by bottom nav dashboard) for the app
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import { palette, radius, shadow } from "../../constants/colors"
// Themed components
import ThemedText from "../../components/ThemedText"
import ThemedView from "../../components/ThemedView"
import Spacer from '../../components/Spacer'
// Placeholder for saved recipes section
const SAVED_RECIPES = [
    { emoji: '🍝', name: 'Pasta Arrabiata', meta: '25 min · Italian', bg: palette.greenLight },
    { emoji: '🥘', name: 'Chicken Stir Fry', meta: '20 min · Asian', bg: palette.amberLight },
    { emoji: '🍳', name: 'Tomato Omelette', meta: '10 min · Breakfast', bg: palette.terracottaLight },
    { emoji: '🥗', name: 'Spinach Pasta', meta: '20 min · Italian', bg: palette.freshLight },
]

const Home = () => {
    return (
        <ThemedView style={styles.container} safe>
            {/* Use safe=true for safeAreaView */}
            <ScrollView
                contentContainerStyle={[styles.scroll, { paddingTop: 16 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <ThemedText style={styles.greetingSub}>Good morning ☀️</ThemedText>
                        <ThemedText style={styles.greetingMain} serif>Make a Dishcision</ThemedText>
                    </View>
                    <View style={styles.avatar}>
                        <ThemedText style={styles.avatarText} serif>A</ThemedText>
                    </View>
                </View>

                {/* Expiry Alert */}
                <Pressable style={({ pressed }) => [styles.expiryAlert, pressed && styles.pressed]}>
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

                {/* Saved Recipes */}
                <View style={styles.sectionHeader}>
                    <ThemedText style={styles.sectionTitle} serif >Saved Recipes</ThemedText>
                    <ThemedText style={styles.sectionAction}>See All</ThemedText>
                </View>
                {/* Horizontal scroll bar for saved recipes section */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.hScroll}
                >
                    {SAVED_RECIPES.map((recipe) => (
                        <Pressable
                            key={recipe.name}
                            style={({ pressed }) => [styles.recipeCardMini, pressed && styles.pressed]}
                            onPress={() => router.push('/recipe-detail')}
                        >
                            <View style={[styles.recipeCardImg, { backgroundColor: recipe.bg }]}>
                                <ThemedText style={{ fontSize: 36 }}>{recipe.emoji}</ThemedText>
                            </View>
                            <View style={{ padding: 10 }}>
                                <ThemedText style={styles.recipeCardName}>{recipe.name}</ThemedText>
                                <ThemedText style={styles.recipeCardMeta}>⏱ {recipe.meta}</ThemedText>
                            </View>
                        </Pressable>
                    ))}
                </ScrollView>

                <Spacer height={16} />
            </ScrollView>

        </ThemedView>
    )
}
export default Home

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