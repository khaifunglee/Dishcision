// This page serves as the recipe details page for the app
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View, } from "react-native"
import { useMemo } from 'react'
import { Feather } from '@expo/vector-icons'
import { palette, radius, useAppColors } from "../constants/colors"
// Themed components
import ThemedText from "../components/ThemedText"
import ThemedView from "../components/ThemedView"

// Placeholder data for recipe details
const INGREDIENTS = [
    { name: 'Penne pasta', qty: '200g', have: true },
    { name: 'Tomatoes (or canned)', qty: '3 pieces', have: true },
    { name: 'Garlic', qty: '3 cloves', have: true },
    { name: 'Olive oil', qty: '2 tbsp', have: true },
    { name: 'Chilli flakes', qty: '1 tsp', have: true },
    { name: 'Parmesan (to serve)', qty: '30g', have: false },
]

const STEPS = [
    'Boil a large pot of salted water and cook the penne until al dente, about 10–12 minutes. Reserve ½ cup pasta water before draining.',
    'Meanwhile, heat olive oil in a pan over medium heat. Add minced garlic and chilli flakes, cook for 1–2 minutes until fragrant.',
    'Add crushed tomatoes, season with salt and pepper, and simmer for 10 minutes until the sauce thickens.',
    'Toss the drained pasta in the sauce, adding a splash of pasta water to loosen if needed. Serve with grated parmesan.',
]

const RecipeDetails = () => {
    const c = useAppColors()

    // Dynamic styles that depend on theme colors
    const themed = useMemo(() => ({
        card: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
        }
    }), [c])

    return (
        <ThemedView style={styles.container} >

            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}>
                {/* Recipe Header */}
                <View style={styles.header}>
                    <Pressable style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
                        onPress={() => router.back()}>
                        <Feather name={'chevron-left'} size={22} color={'white'} />
                    </Pressable>
                    <View>
                        <ThemedText style={{ fontSize: 100 }} serif >🍝</ThemedText>
                    </View>
                    <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.pressed]}>
                        <ThemedText style={{ fontSize: 18 }}>🔖</ThemedText>
                    </Pressable>
                </View>

                <View style={styles.body}>
                    {/* Tags and Title */}
                    <View>
                        <View style={styles.tagRow}>
                            {['Italian', 'Vegetarian'].map((t) => (
                                <View key={t} style={[styles.tag, { backgroundColor: c.creamDark, borderColor: c.warmGray }]}>
                                    <ThemedText style={styles.tagText} subtitle>{t}</ThemedText>
                                </View>
                            ))}
                            <View style={[styles.tag, { backgroundColor: c.freshLight, borderColor: c.fresh }]}>
                                <ThemedText style={[styles.tagFullText, { color: c.fresh }]}>✓ Full match</ThemedText>
                            </View>
                        </View>
                    </View>

                    <ThemedText style={styles.recipeTitle} serif>Pasta Arrabiata</ThemedText>

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        {[
                            { val: '25', lbl: 'MINUTES' },
                            { val: '2', lbl: 'SERVINGS' },
                            { val: '$3.20', lbl: 'PER SERVE' },
                            { val: '420', lbl: 'CALORIES' },
                        ].map((s) => (
                            <View key={s.lbl} style={[styles.statCard, themed.card]}>
                                <ThemedText style={styles.statVal} serif >{s.val}</ThemedText>
                                <ThemedText style={styles.statLbl} subtitle>{s.lbl}</ThemedText>
                            </View>
                        ))}
                    </View>

                    {/* Ingredients */}
                    <ThemedText style={styles.sectionTitle} serif>Ingredients</ThemedText>
                    {INGREDIENTS.map((ing) => (
                        <View key={ing.name} style={styles.ingrItem}>
                            <View style={styles.ingrItemLeft}>
                                <View style={[styles.checkCircle, ing.have ? { backgroundColor: c.freshLight } : [styles.checkMissing, { backgroundColor: c.redLight, borderColor: c.red }]]}>
                                    <ThemedText style={{ fontSize: 10 }}>{ing.have ? '✓' : 'X'}</ThemedText>
                                </View>
                                <ThemedText style={[ing.name, !ing.have && { color: c.red }]}>{ing.name}</ThemedText>
                            </View>
                            <ThemedText style={styles.ingrQty} subtitle>{ing.qty}</ThemedText>
                        </View>
                    ))}

                    {/* Instructions */}
                    <ThemedText style={styles.sectionTitle} serif>Instructions</ThemedText>
                    {STEPS.map((steps, i) => (
                        <View key={i} style={styles.stepItem}>
                            <View style={styles.stepNum}>
                                <ThemedText style={styles.stepNumText}>{i + 1}</ThemedText>
                            </View>
                            <ThemedText style={styles.stepText}>{steps}</ThemedText>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Floating Button */}
            <View style={[styles.floatingContainer, { bottom: 52 }]}>
                <Pressable style={({ pressed }) => [styles.cookBtn, pressed && styles.pressed]}>
                    <ThemedText style={styles.cookBtnText}>I cooked this</ThemedText>
                </Pressable>
            </View>
        </ThemedView>
    )
}
export default RecipeDetails

const styles = StyleSheet.create({
    container: { flex: 1, },
    header: {
        backgroundColor: palette.green,
        height: 260,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 52,
        paddingBottom: 28,
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

    body: { padding: 24, gap: 12 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
    tag: {
        paddingVertical: 3, paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: radius.full,
    },
    tagText: { fontSize: 10 },
    tagFullText: { fontFamily: 'DMSans_600SemiBold', fontSize: 10 },

    recipeTitle: { fontSize: 28, letterSpacing: -1, lineHeight: 36, },

    statsRow: { flexDirection: 'row', gap: 8, marginTop: 10, },
    statCard: {
        flex: 1,
        borderWidth: 1, borderRadius: radius.small,
        padding: 10, alignItems: 'center',
    },
    statVal: { fontSize: 17, },
    statLbl: {
        fontFamily: 'DMSans_500Medium', fontSize: 9,
        letterSpacing: 0.5, marginTop: 2, textAlign: 'center'
    },

    sectionTitle: { fontSize: 18, letterSpacing: -0.5, marginTop: 20, marginBottom: 12, },

    ingrItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: palette.beige,
    },
    ingrItemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, },

    checkCircle: {
        width: 22, height: 22, borderRadius: radius.full,
        alignItems: 'center', justifyContent: 'center',
    },
    checkMissing: {
        borderWidth: 1.5, borderStyle: 'dashed',
    },
    ingrName: { flex: 1, fontSize: 14, },
    //ingrMissing: { color: palette.red },
    ingrQty: { fontSize: 12 },

    stepItem: { flexDirection: 'row', gap: 14, },
    stepNum: {
        width: 28, height: 28,
        backgroundColor: palette.green,
        borderRadius: 8,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 1,
    },
    stepNumText: { fontFamily: 'DMSans_600SemiBold', fontSize: 12, color: '#fff', },
    stepText: { flex: 1, fontSize: 14, lineHeight: 22 },

    floatingContainer: {
        position: 'absolute', left: 0, right: 0,
        alignItems: 'center',
    },
    cookBtn: {
        backgroundColor: palette.terracotta,
        borderRadius: radius.full,
        paddingVertical: 16, paddingHorizontal: 32,
        shadowColor: palette.terracotta,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    cookBtnText: { fontFamily: 'DMSans_600SemiBold', fontSize: 16, color: '#fff' },

    pressed: { opacity: 0.7 }
})