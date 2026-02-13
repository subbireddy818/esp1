import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { Ionicons } from '@expo/vector-icons';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { router } from 'expo-router';
import { mockTournaments, currentUser } from '@/services/mockData';

export default function CreatorDashboard() {
    const creatorDeployments = mockTournaments.filter(t => t.creatorId === currentUser.id);
    const activeDeployments = creatorDeployments.filter(t => t.status === 'live' || t.status === 'upcoming');

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>OPS COMMAND</Text>
                        <Text style={styles.subtitle}>TOURNAMENT MANAGER // ID: CR-88</Text>
                    </View>
                    <ScaleButton onPress={() => router.replace('/(auth)/login')}>
                        <View style={styles.powerBtn}>
                            <Ionicons name="power" size={20} color={Colors.danger} />
                        </View>
                    </ScaleButton>
                </View>

                {/* System Stats - Real Data */}
                <View style={styles.statsGrid}>
                    <StatBox
                        label="ACTIVE"
                        value={activeDeployments.length.toString()}
                        icon="flash"
                        color={Colors.primary}
                    />
                    <StatBox
                        label="PARTICIPANTS"
                        value={activeDeployments.reduce((acc, t) => acc + t.currentPlayers, 0).toString()}
                        icon="people"
                        color={Colors.accent}
                    />
                    <StatBox
                        label="PRIZE POOL"
                        value={`₹${activeDeployments.reduce((acc, t) => acc + t.prizePool, 0)}`}
                        icon="trophy"
                        color={Colors.warning}
                    />
                </View>

                {/* Main Action Hub */}
                <Text style={styles.sectionTitle}>COMMAND MODULES</Text>
                <View style={styles.actionGrid}>
                    <ActionCard
                        title="LAUNCH TOURNAMENT"
                        desc="Configure new battle parameters"
                        icon="add-circle"
                        color={Colors.primary}
                        onPress={() => router.push('/creator/create')}
                    />
                    <ActionCard
                        title="TEAM MANAGEMENT"
                        desc="Verify rosters & background checks"
                        icon="shield-checkmark"
                        color={Colors.info}
                        onPress={() => router.push('/creator/teams')}
                    />
                </View>

                {/* Data Driven Live List */}
                <Text style={styles.sectionTitle}>LIVE DEPLOYMENTS</Text>

                {activeDeployments.map((tournament) => (
                    <TacticalCard key={tournament.id} noPadding style={styles.tournamentCard}>
                        <View style={styles.tournamentRow}>
                            <View style={[
                                styles.statusIndicator,
                                { backgroundColor: tournament.status === 'live' ? Colors.danger : Colors.primary }
                            ]} />
                            <View style={styles.tInfo}>
                                <Text style={styles.tTitle}>{tournament.title}</Text>
                                <Text style={styles.tMeta}>
                                    {tournament.type.toUpperCase()} • {tournament.map.toUpperCase()} • {tournament.currentPlayers}/{tournament.maxPlayers}
                                </Text>
                            </View>
                            <View style={styles.actionButtons}>
                                <ScaleButton
                                    onPress={() => router.push({
                                        pathname: '/creator/roster/[id]',
                                        params: { id: tournament.id }
                                    })}
                                >
                                    <View style={styles.rosterBtn}>
                                        <Ionicons name="people-outline" size={14} color={Colors.accent} />
                                        <Text style={styles.rosterBtnText}>ROSTER</Text>
                                    </View>
                                </ScaleButton>
                                <ScaleButton
                                    onPress={() => router.push({
                                        pathname: '/creator/edit/[id]',
                                        params: { id: tournament.id }
                                    })}
                                >
                                    <View style={styles.editBtn}>
                                        <Text style={styles.editBtnText}>MANAGE</Text>
                                        <Ionicons name="settings-outline" size={14} color={Colors.primary} />
                                    </View>
                                </ScaleButton>
                            </View>
                        </View>
                    </TacticalCard>
                ))}

                {activeDeployments.length === 0 && (
                    <Text style={styles.emptyText}>NO ACTIVE DEPLOYMENTS FOUND</Text>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </GradientBackground>
    );
}

function StatBox({ label, value, icon, color }: { label: string, value: string, icon: any, color: string }) {
    return (
        <TacticalCard style={styles.statBox} noPadding>
            <View style={styles.statContent}>
                <Ionicons name={icon} size={18} color={color} />
                <Text style={[styles.statValue, { color }]}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
            </View>
        </TacticalCard>
    );
}

function ActionCard({ title, desc, icon, color, onPress }: { title: string, desc: string, icon: any, color: string, onPress: () => void }) {
    return (
        <TacticalCard style={styles.actionCard} noPadding>
            <ScaleButton style={styles.actionBtn} onPress={onPress}>
                <View style={[styles.iconBox, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
                    <Ionicons name={icon} size={24} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.actionTitle}>{title}</Text>
                    <Text style={styles.actionDesc}>{desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </ScaleButton>
        </TacticalCard>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    title: { color: Colors.textPrimary, fontSize: 30, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace' },
    subtitle: { color: Colors.accent, fontSize: 10, letterSpacing: 2, marginTop: 4, fontWeight: 'bold', fontFamily: 'monospace' },

    powerBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },

    statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)' },
    statContent: { padding: 12, alignItems: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 4 },
    statLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 2, fontWeight: '900', letterSpacing: 1 },

    actionGrid: { gap: 16, marginBottom: 24 },
    actionCard: { overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.03)' },
    actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16 },
    iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
    actionTitle: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15, letterSpacing: 1, fontFamily: 'monospace' },
    actionDesc: { color: Colors.textSecondary, fontSize: 11, marginTop: 2 },

    sectionTitle: { color: Colors.textSecondary, fontSize: 12, fontWeight: '900', marginTop: 24, marginBottom: 12, letterSpacing: 2, fontFamily: 'monospace' },

    tournamentCard: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.02)' },
    tournamentRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    statusIndicator: { width: 4, height: 32, borderRadius: 2, marginRight: 16 },
    tInfo: { flex: 1 },
    tTitle: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
    tMeta: { color: Colors.textMuted, fontSize: 10, marginTop: 4, fontFamily: 'monospace' },

    editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(234, 179, 8, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.2)' },
    editBtnText: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1 },

    actionButtons: { flexDirection: 'row', gap: 8 },
    rosterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(6, 182, 212, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.2)' },
    rosterBtnText: { color: Colors.accent, fontSize: 10, fontWeight: '900', letterSpacing: 1 },

    emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontFamily: 'monospace', fontSize: 12 },
});
