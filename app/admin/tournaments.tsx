import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { mockTournaments, mockUsers, Tournament } from '@/services/mockData';
import { Button } from '@/components/ui/Button';

export default function AdminTournaments() {
    const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'completed'>('all');
    const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

    const filteredTournaments = mockTournaments.filter(t => {
        if (filter === 'all') return true;
        return t.status === filter;
    });

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ScaleButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.title}>GLOBAL OVERSIGHT</Text>
                        <Text style={styles.subtitle}>SYSTEM DEPLOYMENTS MANAGER</Text>
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filterBar}>
                    <FilterTab label="ALL" active={filter === 'all'} onPress={() => setFilter('all')} />
                    <FilterTab label="LIVE" active={filter === 'live'} onPress={() => setFilter('live')} />
                    <FilterTab label="UPCOMING" active={filter === 'upcoming'} onPress={() => setFilter('upcoming')} />
                    <FilterTab label="COMPLETED" active={filter === 'completed'} onPress={() => setFilter('completed')} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {filteredTournaments.map((tournament) => {
                        const creator = mockUsers.find(u => u.id === tournament.creatorId);

                        return (
                            <TouchableOpacity key={tournament.id} onPress={() => setSelectedTournament(tournament)} activeOpacity={0.7}>
                                <TacticalCard noPadding style={styles.deploymentCard}>
                                    <View style={styles.deploymentRow}>
                                        <View style={[
                                            styles.statusIndicator,
                                            { backgroundColor: getStatusColor(tournament.status) }
                                        ]} />

                                        <View style={styles.mainInfo}>
                                            <Text style={styles.tTitle}>{tournament.title}</Text>
                                            <View style={styles.metaRow}>
                                                <Ionicons name="person-circle-outline" size={12} color={Colors.accent} />
                                                <Text style={styles.creatorName}>CREATOR: {creator?.username || 'SYSTEM'}</Text>
                                            </View>
                                            <Text style={styles.tMeta}>
                                                {tournament.type.toUpperCase()} • {tournament.map.toUpperCase()} • {tournament.currentPlayers}/{tournament.maxPlayers}
                                            </Text>
                                        </View>

                                        <View style={styles.actions}>
                                            <ScaleButton
                                                onPress={() => router.push({
                                                    pathname: '/creator/roster/[id]',
                                                    params: { id: tournament.id }
                                                })}
                                            >
                                                <View style={styles.actionBtn}>
                                                    <Ionicons name="people-outline" size={16} color={Colors.accent} />
                                                </View>
                                            </ScaleButton>
                                            <ScaleButton
                                                onPress={() => router.push({
                                                    pathname: '/creator/edit/[id]',
                                                    params: { id: tournament.id }
                                                })}
                                            >
                                                <View style={styles.actionBtn}>
                                                    <Ionicons name="settings-outline" size={16} color={Colors.primary} />
                                                </View>
                                            </ScaleButton>
                                        </View>
                                    </View>
                                </TacticalCard>
                            </TouchableOpacity>
                        );
                    })}

                    {filteredTournaments.length === 0 && (
                        <Text style={styles.emptyText}>NO DEPLOYMENTS DETECTED ON THIS FREQUENCY</Text>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>

            {/* Deployment Dossier Modal */}
            <Modal
                visible={!!selectedTournament}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedTournament(null)}
            >
                <View style={styles.modalOverlay}>
                    <TacticalCard style={styles.modalContent} noPadding>
                        {selectedTournament && (
                            <View style={styles.dossierContainer}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>DEPLOYMENT DOSSIER</Text>
                                    <ScaleButton onPress={() => setSelectedTournament(null)}>
                                        <Ionicons name="close" size={24} color={Colors.textMuted} />
                                    </ScaleButton>
                                </View>

                                <View style={styles.dossierBody}>
                                    {/* Creator Metadata */}
                                    <View style={styles.metaSection}>
                                        <Text style={styles.metaLabel}>AUTHORIZED CREATOR</Text>
                                        <View style={styles.creatorInfo}>
                                            <Ionicons name="shield-checkmark" size={20} color={Colors.accent} />
                                            <View style={{ marginLeft: 12 }}>
                                                <Text style={styles.creatorText}>{mockUsers.find(u => u.id === selectedTournament.creatorId)?.username || 'UNKNOWN'}</Text>
                                                <Text style={styles.creatorId}>OPERATOR ID: {selectedTournament.creatorId.toUpperCase()}</Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Temporal Data */}
                                    <View style={styles.metaSection}>
                                        <Text style={styles.metaLabel}>TEMPORAL LOGS</Text>
                                        <View style={styles.timeGrid}>
                                            <View style={styles.timeItem}>
                                                <Text style={styles.timeLabel}>COMMENCED</Text>
                                                <Text style={styles.timeValue}>{new Date(selectedTournament.startTime).toLocaleString()}</Text>
                                            </View>
                                            {selectedTournament.endTime && (
                                                <View style={styles.timeItem}>
                                                    <Text style={styles.timeLabel}>TERMINATED</Text>
                                                    <Text style={styles.timeValue}>{new Date(selectedTournament.endTime).toLocaleString()}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {/* Mission Specs */}
                                    <View style={styles.metaSection}>
                                        <Text style={styles.metaLabel}>MISSION SPECIFICATIONS</Text>
                                        <View style={styles.specsGrid}>
                                            <SpecItem label="TITLE" value={selectedTournament.title} />
                                            <SpecItem label="SECTOR" value={selectedTournament.map} />
                                            <SpecItem label="UNIT TYPE" value={selectedTournament.type.toUpperCase()} />
                                            <SpecItem label="PRIZE" value={`₹${selectedTournament.prizePool}`} />
                                        </View>
                                    </View>

                                    <Button
                                        title="ACCESS BATTLE ROSTER"
                                        fullWidth
                                        onPress={() => {
                                            router.push({
                                                pathname: '/creator/roster/[id]',
                                                params: { id: selectedTournament.id }
                                            });
                                            setSelectedTournament(null);
                                        }}
                                        icon={<Ionicons name="people" size={18} color={Colors.background} />}
                                    />
                                </View>
                            </View>
                        )}
                    </TacticalCard>
                </View>
            </Modal>
        </GradientBackground>
    );
}

function FilterTab({ label, active, onPress }: { label: string, active: boolean, onPress: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.filterTab, active && styles.activeTab]}
        >
            <Text style={[styles.filterLabel, active && styles.activeLabel]}>{label}</Text>
        </TouchableOpacity>
    );
}

function SpecItem({ label, value }: { label: string, value: string }) {
    return (
        <View style={styles.specItem}>
            <Text style={styles.specLabel}>{label}</Text>
            <Text style={styles.specValue}>{value}</Text>
        </View>
    );
}

function getStatusColor(status: string) {
    switch (status) {
        case 'live': return Colors.danger;
        case 'completed': return Colors.success;
        case 'cancelled': return Colors.textMuted;
        default: return Colors.primary;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
    subtitle: { color: Colors.primary, fontSize: 10, letterSpacing: 2, marginTop: 4, fontWeight: 'bold' },

    filterBar: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 8, flexWrap: 'wrap' },
    filterTab: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: 'transparent' },
    activeTab: { backgroundColor: 'rgba(234, 179, 8, 0.1)', borderColor: 'rgba(234, 179, 8, 0.3)' },
    filterLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    activeLabel: { color: Colors.primary },

    scrollContent: { paddingHorizontal: 20 },
    deploymentCard: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.02)' },
    deploymentRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    statusIndicator: { width: 4, height: 40, borderRadius: 2, marginRight: 16 },

    mainInfo: { flex: 1 },
    tTitle: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 14, letterSpacing: 0.5 },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
    creatorName: { color: Colors.accent, fontSize: 9, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
    tMeta: { color: Colors.textMuted, fontSize: 10, marginTop: 4, fontFamily: 'monospace' },

    actions: { flexDirection: 'row', gap: 8 },
    actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },

    emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontFamily: 'monospace', fontSize: 12 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: Colors.background, borderWidth: 1, borderColor: 'rgba(234, 179, 8, 0.3)' },
    dossierContainer: { padding: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: 12 },
    modalTitle: { color: Colors.textPrimary, fontSize: 18, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace' },

    dossierBody: { gap: 20 },
    metaSection: {},
    metaLabel: { color: Colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8, fontFamily: 'monospace' },
    creatorInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(6, 182, 212, 0.05)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(6, 182, 212, 0.1)' },
    creatorText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 16 },
    creatorId: { color: Colors.accent, fontSize: 10, marginTop: 2, fontFamily: 'monospace' },

    timeGrid: { gap: 12 },
    timeItem: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 10, borderRadius: 6 },
    timeLabel: { color: Colors.textMuted, fontSize: 9, fontWeight: 'bold', marginBottom: 2 },
    timeValue: { color: Colors.textPrimary, fontSize: 12, fontFamily: 'monospace' },

    specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    specItem: { width: '47%', backgroundColor: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 6 },
    specLabel: { color: Colors.textMuted, fontSize: 8, fontWeight: 'bold' },
    specValue: { color: Colors.textPrimary, fontSize: 12, fontWeight: 'bold', marginTop: 2 },
});
