// This page serves as a recipe page (accessible by bottom nav dashboard) for the app
import { StyleSheet } from "react-native"
// Themed components
import Spacer from "../../components/Spacer"
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"

const Recipes = () => {
    return (
        <ThemedView style={styles.container}>

            <ThemedText title={true} style={styles.heading}>
                This is the Recipes Page.
            </ThemedText>
            <Spacer />

        </ThemedView>
    )
}
export default Recipes

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
})