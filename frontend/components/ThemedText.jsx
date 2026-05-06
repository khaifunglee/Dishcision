// This standard native view component is a template for texts styled with the app's theme colours.
import { Text } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { Colors } from '../constants/colors'

// Use themed text component by passing a style prop into the component to style other pages (and gather any other props)
const ThemedText = ({ style, subtitle = false, serif = false, ...props }) => {

    // Select light/dark colour theme from colors.js based on settings toggle
    const { isDark } = useTheme()
    const theme = isDark ? Colors.dark : Colors.light
    const textColor = subtitle ? theme.textSoft : theme.text
    const fontFamily = serif ? 'Fraunces_600SemiBold' : 'DMSans_400Regular'
    return (
        <Text
            style={[{ color: textColor, fontFamily }, style]}
            {...props}
        />
    )
}
export default ThemedText