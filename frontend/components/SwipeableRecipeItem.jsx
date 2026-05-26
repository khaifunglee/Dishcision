// This component is a template for swipeable recipe items (to save recipes in recipe page)
import { useRef } from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import { useAppColors } from '../constants/colors'
// Components
import ThemedText from './ThemedText'

// Function to register a swipe right action
function RightAction({ drag, onSave }) {
    const c = useAppColors()

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            drag.value,
            [-80, 0],
            [1, 0.5],
        )
        return { transform: [{ scale }] }
    })

    return (
        <Pressable
            style={[styles.saveAction, { backgroundColor: c.green }]}
            onPress={() => {
                onSave()
            }}
        >
            <Animated.Text style={[styles.saveActionText, animatedStyle]}>
                🔖
            </Animated.Text>
            <Animated.Text style={[styles.saveActionLabel, animatedStyle]}>
                Save
            </Animated.Text>
        </Pressable>
    )
}

export default function SwipeableRecipeItem({ recipe, onPress, onSave }) {
    if (!recipe) return null

    const c = useAppColors()
    const swipeRef = useRef(null)

    const handleSave = () => {
        swipeRef.current?.close()
        onSave()
    }

    return (
        <Swipeable
            ref={swipeRef}
            renderRightActions={(progress, drag) => (
                <RightAction drag={drag} onSave={handleSave} />
            )}
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