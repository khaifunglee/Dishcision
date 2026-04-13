// This standard native view component is a template for app pages styled with the app's theme colours.
import { View, useColorScheme } from 'react-native'
import { Colors } from '../constants/colors'

// Use themed view component by passing a style prop into the component to style other pages (and gather any other props)
const ThemedView = ({ style, ...props }) => {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light
    return (
        <View
            style={[{ backgroundColor: theme.background }, style]}
            {...props}
        />
    )
}
export default ThemedView