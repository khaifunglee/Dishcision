// This page serves as the home dashboard page (accessible by bottom nav dashboard) for the app
import { StyleSheet } from "react-native"
// Themed components
import Spacer from "../../components/Spacer"
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"

const Home = () => {
    return (
        <ThemedView style={styles.container} safe={true}>
            {/* Use safe=true for safeAreaView */}

            <ThemedText title={true} style={styles.heading}>
                This is the Home Page.
            </ThemedText>
            <Spacer />

        </ThemedView>
    )
}
export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center', // comment this out to test safe area view
    },
    heading: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    }
})