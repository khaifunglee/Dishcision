// This component is a template for adding margins for app pages (adds default width & height for spacers)
import { View } from 'react-native'

const Spacer = ({ width = "100%", height = 40 }) => {
    return (
        <View style={{ width, height }} />
    )
}
export default Spacer