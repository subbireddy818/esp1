import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { ScreenHeader } from '@/components/ui/ScreenHeader'; // Assuming this exists or I'll use a custom one
import { TacticalCard } from '@/components/ui/TacticalCard';
import { ScaleButton } from '@/components/ui/ScaleButton';

export default function SettingsScreen() {
    const [pushEnabled, setPushEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [hapticsEnabled, setHapticsEnabled] = useState(true);
    const [friendRequests, setFriendRequests] = useState(true);

    const handleClearCache = () => {
        Alert.alert('CACHE CLEARED', 'System cache purged successfully.', [{ text: 'OK' }]);
    };

    return (
        <GradientBackground>
            <View style={styles.header}>
                <ScaleButton onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
                </ScaleButton>
                <Text style={styles.headerTitle}>SYSTEM SETTINGS</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* General Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>GENERAL</Text>
                    <TacticalCard noPadding>
                        <SettingItem
                            label="Push Notifications"
                            icon="notifications-outline"
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                        />
                        <SettingItem
                            label="Sound Effects"
                            icon="volume-high-outline"
                            value={soundEnabled}
                            onValueChange={setSoundEnabled}
                        />
                        <SettingItem
                            label="Haptic Feedback"
                            icon="phone-portrait-outline"
                            value={hapticsEnabled}
                            onValueChange={setHapticsEnabled}
                            last
                        />
                    </TacticalCard>
                </View>

                {/* Privacy */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PRIVACY & SECURITY</Text>
                    <TacticalCard noPadding>
                        <SettingItem
                            label="Allow Friend Requests"
                            icon="people-outline"
                            value={friendRequests}
                            onValueChange={setFriendRequests}
                            last
                        />
                    </TacticalCard>
                </View>

                {/* System Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SYSTEM ACTIONS</Text>
                    <TacticalCard noPadding>
                        <ActionItem
                            label="Clear Cache"
                            icon="trash-outline"
                            onPress={handleClearCache}
                        />
                        <ActionItem
                            label="Report a Bug"
                            icon="bug-outline"
                            onPress={() => Alert.alert('Report Bug', 'Opening bug report terminal...')}
                        />
                        <ActionItem
                            label="About BattleZone"
                            icon="information-circle-outline"
                            onPress={() => Alert.alert('BattleZone', 'Version 2.0.4 [Tactical Build]')}
                            last
                        />
                    </TacticalCard>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.version}>SYS.VER.2.0.4</Text>
                    <Text style={styles.copyright}>© 2026 BATTLEZONE ESPORTS</Text>
                </View>

            </ScrollView>
        </GradientBackground>
    );
}

function SettingItem({ label, icon, value, onValueChange, last }: { label: string; icon: keyof typeof Ionicons.glyphMap; value: boolean; onValueChange: (v: boolean) => void; last?: boolean }) {
    return (
        <View style={[styles.item, last && { borderBottomWidth: 0 }]}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={20} color={Colors.textSecondary} />
            </View>
            <Text style={styles.label}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: Colors.surfaceLight, true: 'rgba(234,179,8,0.3)' }}
                thumbColor={value ? Colors.primary : Colors.textMuted}
            />
        </View>
    );
}

function ActionItem({ label, icon, onPress, last }: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void; last?: boolean }) {
    return (
        <ScaleButton style={[styles.item, last && { borderBottomWidth: 0 }]} onPress={onPress}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={20} color={Colors.textSecondary} />
            </View>
            <Text style={styles.label}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </ScaleButton>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.md },
    backBtn: { padding: 8 },
    headerTitle: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, letterSpacing: 2, fontFamily: 'monospace' },

    content: { padding: Spacing.lg, paddingBottom: 100 },

    section: { marginBottom: Spacing.xl },
    sectionTitle: { color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: FontWeights.bold, letterSpacing: 1.5, marginBottom: Spacing.xs, marginLeft: Spacing.xs },

    item: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
    iconBox: { width: 32, alignItems: 'center', marginRight: Spacing.sm },
    label: { flex: 1, color: Colors.textPrimary, fontSize: FontSizes.sm, fontWeight: FontWeights.medium },

    footer: { alignItems: 'center', marginTop: Spacing.xl },
    version: { color: Colors.textMuted, fontFamily: 'monospace', fontSize: 10 },
    copyright: { color: Colors.textMuted, fontSize: 10, marginTop: 4 },
});
