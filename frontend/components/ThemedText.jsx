// This standard native view component is a template for texts styled with the app's theme colours.
import { Text } from 'react-native'
import { useTheme, TEXT_SCALE } from '../context/ThemeContext'
import { Colors } from '../constants/colors'

const ThemedText = ({ style, subtitle = false, serif = false, ...props }) => {
    const { isDark, textSize } = useTheme()
    const theme = isDark ? Colors.dark : Colors.light
    const textColor = subtitle ? theme.textSoft : theme.text
    const fontFamily = serif ? 'Fraunces_600SemiBold' : 'DMSans_400Regular'
    const scale = TEXT_SCALE[textSize] ?? 1.0

    // Apply scale to any explicit fontSize in the style prop(s)
    const scaleStyle = (s) => {
        if (!s || typeof s !== 'object') return s
        if (!s.fontSize) return s
        return { ...s, fontSize: s.fontSize * scale }
    }

    const scaledStyle = Array.isArray(style)
        ? style.map(scaleStyle)
        : scaleStyle(style)

    return (
        <Text
            style={[{ color: textColor, fontFamily }, scaledStyle]}
            {...props}
        />
    )
}
export default ThemedText
