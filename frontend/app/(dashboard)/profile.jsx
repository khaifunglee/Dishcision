// Profile / Settings screen — reads from and writes to GET/PUT /api/preferences
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Modal, Alert, TextInput, ActivityIndicator } from "react-native"
import { useMemo, useState, useCallback, useEffect } from "react"
import { useFocusEffect } from "expo-router"
import { radius, palette, useAppColors } from "../../constants/colors"
import { useAuth } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { getPreferences, updatePreferences } from "../../api/preferencesApi"
import client from "../../api/client"
import * as SecureStore from 'expo-secure-store'
// Themed components
import ThemedView from "../../components/ThemedView"
import ThemedText from "../../components/ThemedText"
import Spacer from "../../components/Spacer"


// Constants
const DIET_OPTIONS = [
    { label: 'Vegetarian', tag: 'VEGETARIAN' },
    { label: 'Vegan', tag: 'VEGAN' },
    { label: 'Pescatarian', tag: 'PESCATARIAN' },
    { label: 'Gluten-Free', tag: 'GLUTEN_FREE' },
    { label: 'Dairy-Free', tag: 'DAIRY_FREE' },
]

const ALLERGY_OPTIONS = [
    { label: 'Nuts', tag: 'NUTS' },
    { label: 'Shellfish', tag: 'SHELLFISH' },
    { label: 'Soy', tag: 'SOY' },
    { label: 'Eggs', tag: 'EGGS' },
    { label: 'Dairy', tag: 'DAIRY' },
    { label: 'Wheat', tag: 'WHEAT' },
]

const ALERT_TIMING_OPTIONS = ['1 day before', '2 days before', '3 days before', '5 days before', '7 days before']
const TIMING_TO_DAYS = { '1 day before': 1, '2 days before': 2, '3 days before': 3, '5 days before': 5, '7 days before': 7 }
const DAYS_TO_TIMING = Object.fromEntries(Object.entries(TIMING_TO_DAYS).map(([k, v]) => [v, k]))

const TEXT_SIZE_OPTIONS = ['Small', 'Medium', 'Large']
const SIZE_TO_TAG = { Small: 'SMALL', Medium: 'MEDIUM', Large: 'LARGE' }
const TAG_TO_SIZE = { SMALL: 'Small', MEDIUM: 'Medium', LARGE: 'Large' }

// Shared SettingsItem row component (for expiry alerts, daily suggestions, dark mode)
function SettingsItem({ icon, iconBg, label, value, isToggle, toggleValue, onToggle, onPress, isDanger }) {

    const c = useAppColors()
    const themed = useMemo(() => ({
        settingsCard: { backgroundColor: c.uiBackground, borderColor: c.border, borderTopColor: c.border },
    }), [c])

    return (
        <Pressable
            style={({ pressed }) => [styles.settingsItem, themed.settingsCard, pressed && onPress && styles.pressed]}
            onPress={onPress}>
            <View style={styles.settingsLeft}>
                <View style={[styles.settingsIcon, { backgroundColor: iconBg }]}>
                    <Text style={{ fontSize: 16 }}>{icon}</Text>
                </View>
                <ThemedText style={[styles.settingsLabel, isDanger && { color: palette.red }]}>{label}</ThemedText>
            </View>
            {isToggle ? (
                <Switch
                    trackColor={{ false: '#EAE3DC', true: palette.green }}
                    thumbColor='#fff'
                    ios_backgroundColor='#EAE3DC'
                    onValueChange={onToggle}
                    value={toggleValue ?? false}
                />
            ) : (
                <ThemedText style={styles.settingsValue} subtitle>{value || '›'}</ThemedText>
            )}
        </Pressable>
    )
}

// Generic picker modal
function PickerModal({ visible, title, options, selected, onSelect, onClose }) {
    const c = useAppColors()
    return (
        <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={[styles.modalSheet, { backgroundColor: c.uiBackground }]}>
                    <ThemedText style={styles.modalTitle} serif>{title}</ThemedText>
                    {options.map(opt => (
                        <Pressable
                            key={opt}
                            style={[styles.modalOption, selected === opt && { backgroundColor: c.freshLight }]}
                            onPress={() => { onSelect(opt); }}>
                            <ThemedText style={[styles.modalOptionText, selected === opt && { color: c.fresh, fontFamily: 'DMSans_600SemiBold' }]}>
                                {opt}
                            </ThemedText>
                            {selected === opt && <ThemedText style={{ color: c.fresh }}>✓</ThemedText>}
                        </Pressable>
                    ))}
                    <Pressable style={[styles.modalCancel, { borderTopColor: c.border }]} onPress={onClose}>
                        <ThemedText style={{ color: c.textSoft }}>Cancel</ThemedText>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

// Multi-select chip modal (for selecting multiple options)
function ChipModal({ visible, title, options, selected, onDone, onClose }) {
    const c = useAppColors()
    const [localSelected, setLocalSelected] = useState(selected)

    // Sync local state from parent whenever the modal opens
    useEffect(() => {
        if (visible) setLocalSelected(selected)
    }, [visible])

    const toggle = (tag) => setLocalSelected(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

    return (
        <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={[styles.modalSheet, { backgroundColor: c.uiBackground }]}>
                    <ThemedText style={styles.modalTitle} serif>{title}</ThemedText>
                    <View style={styles.chipGrid}>
                        {options.map(({ label, tag }) => {
                            const active = localSelected.includes(tag)
                            return (
                                <Pressable
                                    key={tag}
                                    style={[styles.chip,
                                        { borderColor: active ? c.amber : c.border, backgroundColor: active ? c.amberLight : c.uiBackground }]}
                                    onPress={() => toggle(tag)}>
                                    <ThemedText style={[styles.chipText, active && { color: c.amber, fontFamily: 'DMSans_600SemiBold' }]}>
                                        {label}
                                    </ThemedText>
                                </Pressable>
                            )
                        })}
                    </View>
                    <Pressable
                        style={[styles.modalDoneBtn, { backgroundColor: c.green }]}
                        onPress={() => { onDone(localSelected); onClose() }}>
                        <ThemedText style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold' }}>Done</ThemedText>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

// Edit Profile inline form modal
function EditProfileModal({ visible, currentName, onSave, onClose }) {
    const c = useAppColors()
    const [name, setName] = useState(currentName)
    const [saving, setSaving] = useState(false)

    // Update username function
    const handleSave = async () => {
        if (!name.trim()) return
        setSaving(true)
        try {
            const res = await client.put('/auth/name', { name: name.trim() })
            // Persist updated name to SecureStore so it survives app restarts
            await SecureStore.setItemAsync('user_name', res.data.name)
            onSave(res.data)
        } catch (e) {
            Alert.alert('Error', 'Could not update name')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={[styles.modalSheet, { backgroundColor: c.uiBackground }]}>
                    <ThemedText style={styles.modalTitle} serif>Edit Profile</ThemedText>
                    <ThemedText style={styles.modalSubtitle}>CHANGE USERNAME</ThemedText>
                    <TextInput
                        style={[styles.modalInput, { borderColor: c.border, color: c.text }]}
                        value={name}
                        onChangeText={setName}
                        placeholder='Display name'
                        placeholderTextColor={c.textSoft}
                        autoCapitalize='words'
                    />
                    <Spacer height={140}/>
                    <Pressable
                        style={[styles.modalDoneBtn, { backgroundColor: c.green, opacity: saving ? 0.6 : 1 }]}
                        onPress={handleSave}
                        disabled={saving}>
                        <ThemedText style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold' }}>
                            {saving ? 'Saving…' : 'Save'}
                        </ThemedText>
                    </Pressable>
                    <Pressable style={[styles.modalCancel, { borderTopColor: c.border }]} onPress={onClose}>
                        <ThemedText style={{ color: c.textSoft }}>Cancel</ThemedText>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

// Change Password modal
function ChangePasswordModal({ visible, onClose }) {
    const c = useAppColors()
    const [current, setCurrent] = useState('')
    const [next, setNext] = useState('')
    const [confirm, setConfirm] = useState('')
    const [saving, setSaving] = useState(false)

    // Change password function
    const handleSave = async () => {
        if (!current || !next || !confirm) { Alert.alert('Error', 'All fields are required'); return }
        if (next.length < 8) { Alert.alert('Error', 'New password must be at least 8 characters'); return }
        if (next !== confirm) { Alert.alert('Error', 'Passwords do not match'); return }
        setSaving(true)
        try {
            await client.put('/auth/password', { currentPassword: current, newPassword: next })            
            setCurrent(''); setNext(''); setConfirm('')
            Alert.alert('Success', 'Password updated')
            onClose()
        } catch (e) {
            Alert.alert('Error', e.response?.data?.message || 'Could not update password')
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal visible={visible} transparent animationType='slide' onRequestClose={onClose}>
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <View style={[styles.modalSheet, { backgroundColor: c.uiBackground }]}>
                    <ThemedText style={styles.modalTitle} serif>Change Password</ThemedText>                    
                    {[
                        { label: 'Current password', value: current, set: setCurrent },
                        { label: 'New password', value: next, set: setNext },
                        { label: 'Confirm new password', value: confirm, set: setConfirm },
                    ].map(field => (
                        <TextInput
                            key={field.label}
                            style={[styles.modalInput, { borderColor: c.border, color: c.text }]}
                            placeholder={field.label}
                            placeholderTextColor={c.textSoft}
                            secureTextEntry
                            value={field.value}
                            onChangeText={field.set}
                        />
                    ))}
                    <Spacer height={180} />
                    <Pressable
                        style={[styles.modalDoneBtn, { backgroundColor: c.green, opacity: saving ? 0.6 : 1 }]}
                        onPress={handleSave}
                        disabled={saving}>
                        <ThemedText style={{ color: '#fff', fontFamily: 'DMSans_600SemiBold' }}>
                            {saving ? 'Saving…' : 'Update Password'}
                        </ThemedText>
                    </Pressable>
                    <Pressable style={[styles.modalCancel, { borderTopColor: c.border }]} onPress={onClose}>
                        <ThemedText style={{ color: c.textSoft }}>Cancel</ThemedText>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Profile screen
// ─────────────────────────────────────────────────────────────────────────────
const Profile = () => {
    const c = useAppColors()
    const { logout, user, updateUser } = useAuth()                      // user state
    const { isDark, toggleTheme, textSize, setTextSize } = useTheme()   // theme contexts (dark mode & text size)

    const [prefs, setPrefs] = useState(null)                            // user dietary preferences
    const [loadingPrefs, setLoadingPrefs] = useState(true)

    // Modal visibility state
    const [showDietModal, setShowDietModal] = useState(false)
    const [showAllergyModal, setShowAllergyModal] = useState(false)
    const [showTimingModal, setShowTimingModal] = useState(false)
    const [showTextSizeModal, setShowTextSizeModal] = useState(false)
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)

    const themed = useMemo(() => ({
        settingsCard: { backgroundColor: c.uiBackground, borderColor: c.border },
    }), [c])

    // Load user's user prefs, text size upon every refresh
    useFocusEffect(useCallback(() => {
        const load = async () => {
            try {
                setLoadingPrefs(true)
                const data = await getPreferences()
                setPrefs(data)
                // Sync textSize from server into ThemeContext so it persists across sessions
                if (data.textSize) await setTextSize(data.textSize)
            } catch (e) {
                console.error('Failed to load preferences:', e)
            } finally {
                setLoadingPrefs(false)
            }
        }
        load()
    }, []))

    // Helper to update user preferences and update local state
    const savePrefs = async (changes) => {
        try {
            const updated = await updatePreferences(changes)
            setPrefs(updated)
            return updated
        } catch (e) {
            Alert.alert('Error', 'Could not save preferences')
        }
    }

    // Diet label
    const dietLabel = useMemo(() => {
        if (!prefs?.dietTags?.length) return 'None'

        if (prefs?.dietTags?.length < 2) {
        return (prefs.dietTags.map(t => {
            const opt = DIET_OPTIONS.find(o => o.tag === t)
            return opt ? opt.label : t
        })).join(', ')
    } else {
        return (prefs.dietTags.map(t => {
            const opt = DIET_OPTIONS.find(o => o.tag === t)
            return opt ? opt.label : t
        })).slice(0, 1).join(', ').concat(` + ${prefs?.dietTags?.length - 1} more`)
    }
    }, [prefs])

    // Allergies label
    const allergyLabel = useMemo(() => {
        if (!prefs?.allergyTags?.length) return 'None'

        if (prefs?.allergyTags?.length < 3) {
        return (prefs.allergyTags.map(t => {
            const opt = ALLERGY_OPTIONS.find(o => o.tag === t)
            return opt ? opt.label : t
        })).join(', ')
    } else {
        return (prefs.allergyTags.map(t => {
            const opt = ALLERGY_OPTIONS.find(o => o.tag === t)
            return opt ? opt.label : t
        })).slice(0, 2).join(', ').concat(` + ${prefs?.allergyTags?.length - 2} more`)
    }
    }, [prefs])

    const handleDietDone = async (tags) => {
        await savePrefs({ dietTags: tags })
    }

    const handleAllergyDone = async (tags) => {
        await savePrefs({ allergyTags: tags })
    }

    // Expiry alert toggle — off= alert timing to 0, on=restore previous value (default 3)
    const expiryAlertsOn = (prefs?.expiryAlertDays ?? 3) > 0
    const handleExpiryToggle = async (val) => {
        await savePrefs({ expiryAlertDays: val ? 3 : 0 })
    }

    // Daily suggestion toggle
    const handleDailySuggestionToggle = async (val) => {
        await savePrefs({ dailySuggestionOn: val })
    }

    // Alert timing picker
    const timingLabel = useMemo(() => {
        const days = prefs?.expiryAlertDays
        if (!days || days === 0) return '—'
        return DAYS_TO_TIMING[days] || `${days} days before`
    }, [prefs])

    const handleTimingSelect = async (label) => {
        const days = TIMING_TO_DAYS[label]
        if (days) await savePrefs({ expiryAlertDays: days })
    }

    // Text size
    const textSizeLabel = TAG_TO_SIZE[textSize] || 'Medium'
    // Function to change text size (updates immediately)
    const handleTextSizeSelect = async (label) => {
        const tag = SIZE_TO_TAG[label]
        if (tag) {
            await setTextSize(tag)             // immediate UI effect
            await savePrefs({ textSize: tag }) // persist to server
        }
    }

    // Logout function
    const handleLogout = async () => { await logout() }

    // User initial
    const userInitial = useMemo(() => {
        if (!user?.name) return '?'
        return user.name.trim().charAt(0).toUpperCase()
    }, [user])

    return (
        <ThemedView style={styles.container} safe>
            <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
                <View style={[styles.header, { paddingTop: 16 }]}>
                    <View style={styles.avatar}>
                        <ThemedText style={styles.avatarText} serif>{userInitial}</ThemedText>
                    </View>
                    <View>
                        <ThemedText style={styles.profileName} serif>{user?.name || 'Your Name'}</ThemedText>
                        <ThemedText style={styles.profileEmail} subtitle>{user?.email || ''}</ThemedText>
                    </View>
                </View>
                {/* Loading state */}
                {loadingPrefs ? (
                    <ActivityIndicator style={{ marginTop: 40 }} color={c.green} />
                ) : (
                    <>
                        {/* Dietary */}
                        <View style={[styles.settingsGroup, themed.settingsCard]}>
                            <ThemedText style={styles.groupLabel}>DIETARY</ThemedText>
                            <SettingsItem
                                icon="🥗" iconBg={c.freshLight} label="Diet Type"
                                value={`${dietLabel} ›`}
                                onPress={() => setShowDietModal(true)}
                            />
                            <SettingsItem
                                icon="🚫" iconBg={c.terracottaLight} label="Allergies"
                                value={`${allergyLabel} ›`}
                                onPress={() => setShowAllergyModal(true)}
                            />
                        </View>

                        {/* Notifications */}
                        <View style={[styles.settingsGroup, themed.settingsCard]}>
                            <ThemedText style={styles.groupLabel}>NOTIFICATIONS</ThemedText>
                            <SettingsItem
                                icon="⏰" iconBg={c.redLight} label="Expiry Alerts"
                                isToggle toggleValue={expiryAlertsOn}
                                onToggle={handleExpiryToggle}
                            />
                            <SettingsItem
                                icon="🍽️" iconBg={c.greenLight} label="Daily Suggestions"
                                isToggle toggleValue={prefs?.dailySuggestionOn ?? true}
                                onToggle={handleDailySuggestionToggle}
                            />
                            <SettingsItem
                                icon="⚙️" iconBg={c.amberLight} label="Alert Timing"
                                value={`${timingLabel} ›`}
                                onPress={() => expiryAlertsOn && setShowTimingModal(true)}
                            />
                        </View>

                        {/* Appearance */}
                        <View style={[styles.settingsGroup, themed.settingsCard]}>
                            <ThemedText style={styles.groupLabel}>APPEARANCE</ThemedText>
                            <SettingsItem
                                icon="🌙" iconBg={c.creamDark} label="Dark Mode"
                                isToggle toggleValue={isDark}
                                onToggle={toggleTheme}
                            />
                            <SettingsItem
                                icon="Aa" iconBg={c.greenLight} label="Text Size"
                                value={`${textSizeLabel} ›`}
                                onPress={() => setShowTextSizeModal(true)}
                            />
                        </View>

                        {/* Account */}
                        <View style={[styles.settingsGroup, themed.settingsCard]}>
                            <ThemedText style={styles.groupLabel}>ACCOUNT</ThemedText>
                            <SettingsItem
                                icon="✏️" iconBg={c.greenLight} label="Edit Profile"
                                onPress={() => setShowEditProfile(true)}
                            />
                            <SettingsItem
                                icon="🔒" iconBg={c.creamDark} label="Change Password"
                                onPress={() => setShowChangePassword(true)}
                            />
                            <Pressable
                                style={({ pressed }) => [styles.settingsItem, { backgroundColor: c.uiBackground, borderColor: c.border, borderTopColor: c.border }, pressed && styles.pressed]}
                                onPress={handleLogout}>
                                <View style={styles.settingsLeft}>
                                    <View style={[styles.settingsIcon, { backgroundColor: c.redLight }]}>
                                        <Text style={{ fontSize: 16 }}>↩️</Text>
                                    </View>
                                    <ThemedText style={[styles.settingsLabel, { fontFamily: 'DMSans_600SemiBold', color: c.red }]}>
                                        Log Out
                                    </ThemedText>
                                </View>
                            </Pressable>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Modals */}
            <ChipModal
                visible={showDietModal}
                title='Dietary Preferences'
                options={DIET_OPTIONS}
                selected={prefs?.dietTags ?? []}
                onDone={handleDietDone}
                onClose={() => setShowDietModal(false)}
            />
            <ChipModal
                visible={showAllergyModal}
                title='Allergy Tags'
                options={ALLERGY_OPTIONS}
                selected={prefs?.allergyTags ?? []}
                onDone={handleAllergyDone}
                onClose={() => setShowAllergyModal(false)}
            />
            <PickerModal
                visible={showTimingModal}
                title='Alert Timing'
                options={ALERT_TIMING_OPTIONS}
                selected={timingLabel}
                onSelect={handleTimingSelect}
                onClose={() => setShowTimingModal(false)}
            />
            <PickerModal
                visible={showTextSizeModal}
                title='Text Size'
                options={TEXT_SIZE_OPTIONS}
                selected={textSizeLabel}
                onSelect={handleTextSizeSelect}
                onClose={() => setShowTextSizeModal(false)}
            />
            <EditProfileModal
                visible={showEditProfile}
                currentName={user?.name || ''}
                onSave={(updatedUser) => { updateUser(updatedUser); setShowEditProfile(false) }}
                onClose={() => setShowEditProfile(false)}
            />
            <ChangePasswordModal
                visible={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />
        </ThemedView>
    )
}
export default Profile

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1 },
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
    avatarText: { fontSize: 26, color: '#fff' },
    profileName: { fontSize: 22, letterSpacing: -0.5 },
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
        borderTopWidth: 1,
    },
    settingsLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingsIcon: {
        width: 34, height: 34,
        borderRadius: radius.small,
        alignItems: 'center', justifyContent: 'center',
    },
    settingsLabel: { fontSize: 14 },
    settingsValue: { fontSize: 12 },

    // Modal styles
    modalOverlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40,
        gap: 4,
    },
    modalTitle: { fontSize: 20, marginBottom: 8 },
    modalSubtitle: {
        fontFamily: 'DMSans_600SemiBold', fontSize: 12,
        paddingVertical: 4,
    },
    modalOption: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 14, paddingHorizontal: 12,
        borderRadius: radius.small,
    },
    modalOptionText: { fontSize: 15 },
    modalCancel: {
        marginTop: 8, paddingTop: 16,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    modalDoneBtn: {
        marginTop: 16, marginBottom: 8, paddingVertical: 14,
        borderRadius: radius.medium,
        alignItems: 'center',
    },
    modalInput: {
        borderWidth: 1, borderRadius: radius.small,
        padding: 14, fontSize: 14, fontFamily: 'DMSans_400Regular',
        marginBottom: 8,
    },

    // Allergy chip grid
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 8 },
    chip: {
        paddingVertical: 8, paddingHorizontal: 16,
        borderRadius: radius.full, borderWidth: 1.5,
    },
    chipText: { fontSize: 13 },

    pressed: { opacity: 0.7 },
})
