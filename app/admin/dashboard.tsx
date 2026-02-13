import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { Spacing } from '@/constants/spacing';
import { FontSizes, FontWeights } from '@/constants/typography';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { router } from 'expo-router';
import { mockTournaments } from '@/services/mockData';

export default function AdminDashboard() {
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>COMMAND CENTER</Text>
                    <Text style={styles.subtitle}>SYSTEM ADMIN // ACCESS LEVEL 5</Text>
                </View>

                {/* System Status */}
                <TacticalCard variant="highlight">
                    <View style={styles.row}>
                        <Ionicons name="hardware-chip-outline" size={24} color={Colors.primary} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.cardTitle}>SYSTEM STATUS</Text>
                            <Text style={styles.cardValue}>ONLINE - OPTIMAL</Text>
                        </View>
                        <Ionicons name="wifi" size={20} color={Colors.success} />
                    </View>
                </TacticalCard>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>OPERATIONS</Text>
                <View style={styles.grid}>
                    <AdminActionCard
                        title="USER BASE"
                        value="3"
                        icon="people-outline"
                        color={Colors.info}
                        onPress={() => router.push('/admin/users')}
                    />
                    <AdminActionCard
                        title="SQUADS"
                        value="2"
                        icon="shield-outline"
                        color={Colors.gold}
                        onPress={() => router.push('/admin/squads')}
                    />
                </View>

                {/* Second Row */}
                <View style={[styles.grid, { marginTop: 12 }]}>
                    <AdminActionCard
                        title="DEPLOYMENTS"
                        value={mockTournaments.length.toString()}
                        icon="globe-outline"
                        color={Colors.accent}
                        onPress={() => router.push('/admin/tournaments')}
                    />
                    <AdminActionCard
                        title="REPORTS"
                        value="5 NEW"
                        icon="warning-outline"
                        color={Colors.danger}
                        onPress={() => Alert.alert('REPORTS', 'No critical flags identified in this sector.')}
                    />
                </View>

                {/* Financials */}
                <TacticalCard>
                    <Text style={styles.cardTitle}>REVENUE STREAM</Text>
                    <Text style={[styles.cardValue, { color: Colors.success, fontSize: 32 }]}>₹1,45,000</Text>
                    <Text style={styles.subtitle}>Last 30 Days</Text>
                </TacticalCard>

                <Button
                    title="ISSUE GLOBAL NOTIFICATION"
                    onPress={() => Alert.alert('BROADCAST', 'Dispatch global system alert to all active terminals?', [
                        { text: 'CANCEL', style: 'cancel' },
                        { text: 'DISPATCH', onPress: () => Alert.alert('SENT', 'Transmission successful: [PRIORITY ALPHA] System Maintenance scheduled in 2h.') }
                    ])}
                    icon={<Ionicons name="megaphone-outline" size={18} color={Colors.background} />}
                    style={{ marginTop: 24 }}
                />

                <Button title="LOGOUT SYSTEM" variant="outline" onPress={() => router.replace('/(auth)/login')} style={{ marginTop: 12 }} />
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 60 },
    header: { marginBottom: 30 },
    title: { color: Colors.textPrimary, fontSize: 28, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace' },
    subtitle: { color: Colors.primary, fontSize: 10, letterSpacing: 2, marginTop: 4, fontWeight: 'bold', fontFamily: 'monospace' },

    row: { flexDirection: 'row', alignItems: 'center' },
    cardTitle: { color: Colors.textMuted, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    cardValue: { color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },

    sectionTitle: { color: Colors.textSecondary, fontSize: 12, fontWeight: 'bold', marginTop: 24, marginBottom: 12, letterSpacing: 2, fontFamily: 'monospace' },
    grid: { flexDirection: 'row', gap: 12 },
    gridItem: { flex: 1, height: 110 },
    actionItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    actionText: { color: Colors.textSecondary, fontSize: 10, marginTop: 8, fontWeight: 'bold' },
    actionValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4, fontFamily: 'monospace' },
});

function AdminActionCard({ title, value, icon, color, onPress }: { title: string, value: string, icon: any, color: string, onPress: () => void }) {
    return (
        <TacticalCard style={styles.gridItem} noPadding>
            <ScaleButton style={styles.actionItem} onPress={onPress}>
                <Ionicons name={icon} size={28} color={color} />
                <Text style={styles.actionText}>{title}</Text>
                <Text style={[styles.actionValue, { color: color }]}>{value}</Text>
            </ScaleButton>
        </TacticalCard>
    );
}
