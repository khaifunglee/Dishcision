// This standard native view component is a template for app pages styled with the app's theme colours.
import { View, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '../constants/colors'

// Use themed view component by passing a style prop into the component to style other pages (and gather any other props)
// safe=false means no safe view needed
const ThemedView = ({ style, safe = false, ...props }) => {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light

    if (!safe) return (
        <View
            style={[{ backgroundColor: theme.background }, style]}
            {...props}
        />
    )

    const insets = useSafeAreaInsets()

    return (
        <View
            style={[{
                backgroundColor: theme.background,
                paddingTop: insets.top,
                paddingBottom: insets.bottom
            }, style]}
            {...props}
        />
    )
}
export default ThemedView