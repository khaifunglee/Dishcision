// This component is a template for swipeable recipe items (to save recipes in recipe page)
import { useRef } from 'react'
import { View, Pressable, StyleSheet, Animated } from 'react-native'
import { Swipeable } from 'react-native-gesture-handler/ReanimatedSwipeable'
import { useAppColors } from '../hooks/useAppColors'

import ThemedText from './ThemedText'

export default function SwipeableRecipeItem({ recipe, onPress, onSave }) {
    const c = useAppColors()
    const swipeRef = useRef(null)
    // Returns a component which will be rendered beneath the swipeable after being swiped to the left
    const renderRightAction = (progress, dragX) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0.5],
            extrapolate: 'clamp',
        })

        return (
            <Pressable
                style={[styles.saveAction, { backgroundColor: c.green }]}
                onPress={() => {
                    swipeRef.current?.close()
                    onSave()
                }}
            >
                <Animated.Text style={[styles.saveActionText, { transform: [{ scale }] }]}>
                    🔖
                </Animated.Text>
                <Animated.Text style={[styles.saveActionLabel, { transform: [{ scale }] }]}>
                    Save
                </Animated.Text>
            </Pressable>
        )
    }

    return (
        <Swipeable
            ref={swipeRef}
            renderRightActions={renderRightAction}
            rightThreshold={40}
            overshootRight={false}
        >
            <Pressable
                style={[styles.recipeItem, {
                    backgroundColor: c.uiBackground,
                    borderColor: c.border,
                }]}
                onPress={onPress}
            >
                <View style={[styles.recipeThumb, { backgroundColor: recipe.bg }]}>
                    <ThemedText style={{ fontSize: 28 }}>{recipe.emoji}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                    <ThemedText style={styles.recipeName}>{recipe.name}</ThemedText>
                    <ThemedText style={styles.recipeMeta} subtitle>{recipe.meta}</ThemedText>
                </View>
                <View style={[
                    styles.matchPill,
                    { backgroundColor: recipe.matchType === 'full' ? c.freshLight : c.amberLight }
                ]}>
                    <ThemedText style={[
                        styles.matchPillText,
                        { color: recipe.matchType === 'full' ? c.fresh : c.amber }
                    ]}>
                        {recipe.match}
                    </ThemedText>
                </View>
            </Pressable>
        </Swipeable>
    )
}

const styles = StyleSheet.create({
    recipeItem: {
        borderRadius: 12, borderWidth: 1,
        padding: 14,
        flexDirection: 'row', alignItems: 'center', gap: 14,
    },
    recipeThumb: {
        width: 56, height: 56,
        borderRadius: 12,
        alignItems: 'center', justifyContent: 'center',
    },
    recipeName: {
        fontFamily: 'DMSans_600SemiBold', fontSize: 15, marginBottom: 3,
    },
    recipeMeta: { fontSize: 12 },
    matchPill: {
        paddingVertical: 4, paddingHorizontal: 10, borderRadius: 100,
    },
    matchPillText: { fontFamily: 'DMSans_600SemiBold', fontSize: 11 },
    saveAction: {
        width: 72, borderRadius: 12,
        marginLeft: 8,
        alignItems: 'center', justifyContent: 'center', gap: 4,
    },
    saveActionText: { fontSize: 20 },
    saveActionLabel: {
        fontFamily: 'DMSans_600SemiBold', fontSize: 11, color: '#fff',
    },
})