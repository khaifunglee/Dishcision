// This standard native view component is a template for texts styled with the app's theme colours.
import { Text, useColorScheme } from 'react-native'
import { Colors } from '../constants/colors'

// Use themed text component by passing a style prop into the component to style other pages (and gather any other props)
const ThemedText = ({ style, title = false, serif = false, ...props }) => {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light

    const textColor = title ? theme.title : theme.text
    const fontFamily = serif ? 'Fraunces_600SemiBold' : 'DMSans_400Regular'
    return (
        <Text
            style={[{ color: textColor, fontFamily }, style]}
            {...props}
        />
    )
}
export default ThemedText