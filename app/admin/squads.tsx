import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { mockGuilds, Guild } from '@/services/mockData';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { FontSizes } from '@/constants/typography';

export default function SquadRegistry() {
    const [selectedSquad, setSelectedSquad] = useState<Guild | null>(null);

    const handleGuildClick = (guild: Guild) => {
        setSelectedSquad(guild);
    };

    const handleAction = (label: string) => {
        Alert.alert('SYSTEM COMMAND', `Execution of [${label}] initiated for ${selectedSquad?.name}.`);
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ScaleButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.title}>SQUAD REGISTRY</Text>
                        <Text style={styles.subtitle}>ACTIVE UNITS: {mockGuilds.length}</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.list}>
                    {mockGuilds.map(guild => (
                        <ScaleButton key={guild.id} onPress={() => handleGuildClick(guild)}>
                            <TacticalCard style={styles.card} noPadding>
                                <View style={styles.cardContent}>
                                    <View style={styles.emblem}>
                                        <Text style={styles.emblemText}>{guild.tag}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.name}>{guild.name}</Text>
                                        <Text style={styles.stats}>LVL {guild.level} • {guild.members.length} MEMBERS</Text>
                                    </View>
                                    <View style={styles.winBadge}>
                                        <Ionicons name="trophy" size={12} color={Colors.gold} />
                                        <Text style={styles.winText}>{guild.wins} WINS</Text>
                                    </View>
                                </View>
                            </TacticalCard>
                        </ScaleButton>
                    ))}
                </ScrollView>

                {/* Squad Dossier Modal */}
                <Modal
                    visible={!!selectedSquad}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedSquad(null)}
                >
                    <View style={styles.modalOverlay}>
                        <TacticalCard style={styles.dossierCard} noPadding>
                            <View style={styles.dossierHeader}>
                                <View>
                                    <Text style={styles.dossierTitle}>UNIT RECORD: {selectedSquad?.name.toUpperCase()}</Text>
                                    <Text style={styles.dossierStatus}>IDENTIFIER: {selectedSquad?.tag}</Text>
                                </View>
                                <ScaleButton onPress={() => setSelectedSquad(null)}>
                                    <View style={styles.closeBtn}>
                                        <Ionicons name="close" size={20} color={Colors.textPrimary} />
                                    </View>
                                </ScaleButton>
                            </View>

                            <ScrollView style={styles.dossierContent}>
                                <View style={styles.dossierSection}>
                                    <Text style={styles.sectionLabel}>UNIT METRICS</Text>
                                    <TacticalCard style={styles.dataBox}>
                                        <DataRow label="LEVEL" value={selectedSquad?.level.toString() || '0'} />
                                        <DataRow label="CORE LEAD" value={selectedSquad?.leaderId || ''} />
                                        <DataRow label="COMPLEMENT" value={`${selectedSquad?.members.length} OPERATIVES`} />
                                    </TacticalCard>
                                </View>

                                <View style={styles.dossierSection}>
                                    <Text style={styles.sectionLabel}>ENGAGEMENT RECORD</Text>
                                    <View style={styles.statsRow}>
                                        <MiniStat label="MATCHES" value={selectedSquad?.totalMatches.toString() || '0'} color={Colors.primary} />
                                        <MiniStat label="VICTORIES" value={selectedSquad?.wins.toString() || '0'} color={Colors.success} />
                                        <MiniStat label="RANK" value="#12" color={Colors.gold} />
                                    </View>
                                </View>

                                <View style={styles.adminActions}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('FREEZE ASSETS')}>
                                        <Text style={styles.actionBtnText}>FREEZE ASSETS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.danger }]} onPress={() => handleAction('DISBAND UNIT')}>
                                        <Text style={[styles.actionBtnText, { color: Colors.danger }]}>DISBAND UNIT</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </TacticalCard>
                    </View>
                </Modal>
            </View>
        </GradientBackground>
    );
}

function DataRow({ label, value, color }: { label: string, value: string, color?: string }) {
    return (
        <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{label}</Text>
            <Text style={[styles.dataValue, color ? { color } : {}]}>{value}</Text>
        </View>
    );
}

function MiniStat({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <View style={styles.miniStat}>
            <Text style={[styles.miniValue, { color }]}>{value}</Text>
            <Text style={styles.miniLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 1, fontFamily: 'monospace' },
    subtitle: { fontSize: 10, color: Colors.info, letterSpacing: 1, fontWeight: 'bold' },

    list: { gap: 12 },
    card: { marginBottom: 0 },
    cardContent: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },

    emblem: {
        width: 40, height: 40, borderRadius: 8,
        backgroundColor: 'rgba(234,179,8,0.1)', borderWidth: 1, borderColor: Colors.gold,
        alignItems: 'center', justifyContent: 'center'
    },
    emblemText: { color: Colors.gold, fontWeight: '900', fontSize: 12 },

    name: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 16 },
    stats: { color: Colors.textMuted, fontSize: 10, marginTop: 2, fontFamily: 'monospace' },

    winBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 4 },
    winText: { color: Colors.gold, fontSize: 10, fontWeight: 'bold' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
    dossierCard: { height: '70%', overflow: 'hidden', backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.borderAccent },
    dossierHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(6, 182, 212, 0.05)' },
    dossierTitle: { color: Colors.textPrimary, fontSize: 13, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
    dossierStatus: { color: Colors.accent, fontSize: FontSizes.xs, fontWeight: 'bold', marginTop: 4, letterSpacing: 1 },
    closeBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },

    dossierContent: { padding: 20 },
    dossierSection: { marginBottom: 24 },
    sectionLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 10, fontFamily: 'monospace' },
    dataBox: { padding: 12, backgroundColor: 'rgba(255,255,255,0.02)' },
    dataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.05)' },
    dataLabel: { color: Colors.textSecondary, fontSize: 11, fontWeight: 'bold', fontFamily: 'monospace' },
    dataValue: { color: Colors.textPrimary, fontSize: 11, fontFamily: 'monospace' },

    statsRow: { flexDirection: 'row', gap: 12 },
    miniStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
    miniValue: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
    miniLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 4, fontWeight: '900' },

    adminActions: { gap: 12, marginTop: 12, paddingBottom: 40 },
    actionBtn: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
    actionBtnText: { color: Colors.textSecondary, fontSize: 11, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
});
