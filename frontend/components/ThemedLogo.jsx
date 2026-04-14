// This standard native view component is a template for any images styled with the app's theme colours.
import { View, Image, useColorScheme } from 'react-native'
import { Colors } from '../constants/colors'

// Import light & dark theme images (LightLogo & DarkLogo)
import LightLogo from '../assets/favicon.png' // Image component
import DarkLogo from '../assets/favicon.png' // Image component

// Use themed logo component by passing a style prop into the component to style other pages (and gather any other props)
const ThemedLogo = ({ ...props }) => {
    const colorScheme = useColorScheme()
    // if colorScheme is dark return DarkLogo, otherwise return LightLogo by default (works for if colorScheme == null too)
    const logo = colorScheme === 'dark' ? DarkLogo : LightLogo
    return (
        <Image source={logo} {...props} />
    )
}
export default ThemedLogo