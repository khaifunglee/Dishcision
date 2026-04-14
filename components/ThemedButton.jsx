// This component serves to act as a template for pressable buttons
import { Pressable, StyleSheet } from 'react-native'
import { Colors } from '../constants/colors'

function ThemedButton({ style, ...props }) {
    return (
        <Pressable
            style={({ pressed }) => [styles.btn, pressed && styles.pressed,
                style]}
            {...props}
        />
    )
}
const styles = StyleSheet.create({
    btn: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 5
    },
    pressed: {
        opacity: 0.7
    }
})

export default ThemedButton