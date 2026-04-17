// This page serves as a profile page (accessible by bottom nav dashboard) for the app
import { StyleSheet } from "react-native"
import { useAuth } from "../../context/AuthContext"
// Themed components
import Spacer from "../../components/Spacer"
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import ThemedButton from "../../components/ThemedButton"

const Profile = () => {

    const { logout } = useAuth()
    // Business logic for logout function
    const handleLogout = async () => {
        await logout() // _layout.js handles redirecting to login page
    }
    return (
        <ThemedView style={styles.container}>

            <ThemedText title={true} style={styles.heading}>
                This is the Profile Page.
            </ThemedText>
            <Spacer />
            <ThemedButton onPress={handleLogout}>
                <ThemedText>Log Out</ThemedText>
            </ThemedButton>

        </ThemedView>
    )
}
export default Profile

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