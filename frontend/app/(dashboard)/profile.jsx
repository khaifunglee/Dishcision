// This page serves as a profile page (accessible by bottom nav dashboard) for the app
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from "react-native"
import { useMemo } from "react"
import { radius, palette, useAppColors } from "../../constants/colors"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"

// Settings item
function SettingsItem({ icon, iconBg, label, value, isToggle, isDanger }) {

    //const [isEnabled, setIsEnabled] = useState(false)
    const { isDark, toggleTheme } = useTheme()

    const c = useAppColors()

    // Dynamic styles that depend on theme colours
    const themed = useMemo(() => ({
        settingsCard: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
            borderTopColor: c.border,
        },
    }), [c])

    return (
        <View style={[styles.settingsItem, themed.settingsCard]}>
            <View style={styles.settingsLeft}>
                <View style={[styles.settingsIcon, { backgroundColor: iconBg }]}>
                    <Text style={{ fontSize: 16 }}>{icon}</Text>
                </View>
                <ThemedText style={[styles.settingsLabel, isDanger && { color: palette.red }]}>{label}</ThemedText>
            </View>
            {isToggle ? (
                <Switch style={styles.toggle}
                    trackColor={{ false: '#FBF7F2', true: palette.green }}
                    thumbColor={isDark ? '#fff' : '#fff'}
                    ios_backgroundColor={'#FBF7F2'}
                    onValueChange={toggleTheme}
                    value={isDark}
                />
            ) : (
                <ThemedText style={styles.settingsValue}>{value || '›'}</ThemedText>
            )}
        </View>
    )
}

const Profile = () => {

    const c = useAppColors()

    // Dynamic styles that depend on theme colours
    const themed = useMemo(() => ({
        settingsCard: {
            backgroundColor: c.uiBackground,
            borderColor: c.border,
        },
        red: {
            color: c.red,
        }
    }), [c])

    const { logout } = useAuth()
    // Business logic for logout function
    const handleLogout = async () => {
        await logout() // _layout.js handles redirecting to login page
    }
    return (
        <ThemedView style={styles.container} safe>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={[styles.header, { paddingTop: 16 }]}>
                    <View style={styles.avatar}>
                        <ThemedText style={styles.avatarText} serif >A</ThemedText>
                    </View>
                    <View>
                        <ThemedText style={styles.profileName} serif>Alex Chen</ThemedText>
                        <ThemedText style={styles.profileEmail} subtitle>alex@email.com</ThemedText>
                    </View>
                </View>

                {/* Dietary */}
                <View style={[styles.settingsGroup, themed.settingsCard]}>
                    <ThemedText style={styles.groupLabel}>DIETARY</ThemedText>
                    <SettingsItem icon="🥗" iconBg={c.freshLight} label="Diet Type" value="No Restrictions ›" />
                    <SettingsItem icon="🚫" iconBg={c.terracottaLight} label="Allergies" value="None ›" />
                </View>

                {/* Notifications */}
                <View style={[styles.settingsGroup, themed.settingsCard]}>
                    <ThemedText style={styles.groupLabel}>NOTIFICATIONS</ThemedText>
                    <SettingsItem icon="⏰" iconBg={c.redLight} label="Expiry Alerts" isToggle />
                    <SettingsItem icon="🍽️" iconBg={c.greenLight} label="Daily Suggestions" isToggle />
                    <SettingsItem icon="⚙️" iconBg={c.amberLight} label="Alert Timing" value="3 days before ›" />
                </View>

                {/* Appearance */}
                <View style={[styles.settingsGroup, themed.settingsCard]}>
                    <ThemedText style={styles.groupLabel}>APPEARANCE</ThemedText>
                    <SettingsItem icon="🌙" iconBg={c.creamDark} label="Dark Mode" isToggle />
                    <SettingsItem icon="Aa" iconBg={c.greenLight} label="Text Size" value="Medium ›" />
                </View>

                {/* Account */}
                <View style={[styles.settingsGroup, themed.settingsCard]}>
                    <ThemedText style={styles.groupLabel}>ACCOUNT</ThemedText>
                    <SettingsItem icon="✏️" iconBg={c.greenLight} label="Edit Profile" />
                    <SettingsItem icon="🔒" iconBg={c.creamDark} label="Change Password" />
                    <Pressable style={({ pressed }) => [styles.settingsItem, themed.settingsCard, pressed && styles.pressed]}
                        onPress={handleLogout}>
                        <View style={styles.settingsLeft}>
                            <View style={[styles.settingsIcon, { backgroundColor: c.redLight }]}>
                                <ThemedText style={{ fontSize: 16 }}>↩️</ThemedText>
                            </View>
                            <ThemedText style={[styles.settingsLabel, { fontFamily: 'DMSans_600SemiBold', color: c.red }]}>Log Out</ThemedText>
                        </View>
                    </Pressable>
                </View>
            </ScrollView>
        </ThemedView>
    )
}
export default Profile

const styles = StyleSheet.create({
    container: { flex: 1, },
    header: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        paddingHorizontal: 24, paddingBottom: 28,
    },
    avatar: {
        width: 64, height: 64,
        backgroundColor: palette.green,
        borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: {
        fontSize: 26, color: '#fff',
    },
    profileName: {
        fontSize: 22, letterSpacing: -0.5,
    },
    profileEmail: { fontSize: 12, marginTop: 2 },

    settingsGroup: {
        marginHorizontal: 24, marginBottom: 24,
        borderRadius: radius.large,
        borderWidth: 1,
        overflow: 'hidden',
    },
    groupLabel: {
        fontFamily: 'DMSans_600SemiBold', fontSize: 10,
        letterSpacing: 1,
        paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6,
    },
    settingsItem: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 14,
        borderTopWidth: 1, //borderTopColor: palette.beige,
    },
    settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, },
    settingsIcon: {
        width: 34, height: 34,
        borderRadius: radius.small,
        alignItems: 'center', justifyContent: 'center',
    },
    settingsLabel: { fontSize: 14, },
    settingsValue: { fontSize: 12, },
    toggle: {

    },

    pressed: { opacity: 0.7 }
})