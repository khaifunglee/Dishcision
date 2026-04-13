// This standard native view component is a template for cards styled with the app's theme colours.
import { View, useColorScheme } from 'react-native'
import { Colors } from '../constants/colors'

// Use themed card component by passing a style prop into the component to style other pages (and gather any other props)
const ThemedCard = ({ style, ...props }) => {
    const colorScheme = useColorScheme()
    // Select light/dark colour theme from colors.js (?? means if colorScheme == null then select Colors.light)
    const theme = Colors[colorScheme] ?? Colors.light
    return (
        <View
            style={[{ backgroundColor: theme.uiBackground }, styles.card]}
            {...props}
        />
    )
}
export default ThemedCard

const styles = StyleSheet.create({
    card: {
        borderRadius: 5,
        padding: 20
    }
})