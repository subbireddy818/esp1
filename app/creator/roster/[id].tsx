import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { Ionicons } from '@expo/vector-icons';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { mockTournaments, mockUsers, currentUser } from '@/services/mockData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

export default function TournamentRoster() {
    const { id } = useLocalSearchParams();
    const tournament = mockTournaments.find(t => t.id === id);
    const [bannedUsers, setBannedUsers] = useState<string[]>([]);

    if (!tournament) {
        return (
            <GradientBackground>
                <View style={styles.center}>
                    <Text style={styles.errorText}>DEPLOYMENT NOT FOUND</Text>
                    <ScaleButton onPress={() => router.back()}>
                        <Text style={styles.backLink}>RETURN TO COMMAND</Text>
                    </ScaleButton>
                </View>
            </GradientBackground>
        );
    }

    const participants = tournament.slots.filter(s => s.status === 'locked');
    const isAuthorized = currentUser.role === 'admin' || tournament.creatorId === currentUser.id;

    const toggleBan = (userId: string, username: string) => {
        if (bannedUsers.includes(userId)) {
            setBannedUsers(bannedUsers.filter(id => id !== userId));
            Alert.alert('ENFORCEMENT LIFTED', `User ${username} has been reinstated in this sector.`);
        } else {
            setBannedUsers([...bannedUsers, userId]);
            Alert.alert('ACCESS TERMINATED', `User ${username} has been blacklisted from this deployment.`);
        }
    };

    return (
        <GradientBackground>
            <View style={styles.header}>
                <ScaleButton onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                </ScaleButton>
                <View style={{ marginLeft: 16 }}>
                    <Text style={styles.title}>BATTLE ROSTER</Text>
                    <Text style={styles.subtitle}>{tournament.title.toUpperCase()} // UNIT: {id}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>DEPLOYED</Text>
                        <Text style={styles.summaryValue}>{tournament.currentPlayers}/{tournament.maxPlayers}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>FORMAT</Text>
                        <Text style={styles.summaryValue}>{tournament.type.toUpperCase()}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>PARTICIPANT MANIFEST</Text>

                {participants.map((participant, index) => {
                    const user = participant.userId ? mockUsers.find(u => u.id === participant.userId) : null;
                    const isBanned = user ? bannedUsers.includes(user.id) : false;

                    return (
                        <TacticalCard key={participant.id} style={styles.participantCard} noPadding>
                            <View style={[styles.participantRow, isBanned && { opacity: 0.6 }]}>
                                <Text style={styles.index}>#{index + 1}</Text>

                                <View style={styles.mainInfo}>
                                    <View style={styles.identity}>
                                        <Avatar size="sm" tier={user?.tier || 'bronze'} />
                                        <View style={{ marginLeft: 12 }}>
                                            <Text style={[styles.name, isBanned && { textDecorationLine: 'line-through', color: Colors.textMuted }]}>
                                                {participant.userId ? (user?.username || 'REDACTED') : (participant.teamId || 'UNKNOWN UNIT')}
                                            </Text>
                                            <Text style={styles.id}>
                                                UID: {user?.uid || 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.rowActions}>
                                    <Badge
                                        text={isBanned ? 'BLACKLISTED' : (tournament.status === 'live' ? 'IN COMBAT' : 'AUTHENTICATED')}
                                        variant={isBanned || tournament.status === 'live' ? 'danger' : 'success'}
                                        size="sm"
                                    />

                                    {isAuthorized && user && (
                                        <TouchableOpacity
                                            style={[styles.banBtn, isBanned && styles.unbanBtn]}
                                            onPress={() => toggleBan(user.id, user.username)}
                                        >
                                            <Ionicons
                                                name={isBanned ? "shield-outline" : "hammer-outline"}
                                                size={14}
                                                color={isBanned ? Colors.success : Colors.danger}
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TacticalCard>
                    );
                })}

                {participants.length === 0 && (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>NO REGISTERED PARTICIPANTS FOUND</Text>
                    </View>
                )}

                {participants.length > 0 && (
                    <Button
                        title="VERIFY & SYNC ROSTER"
                        onPress={() => Alert.alert('SYSTEM SYNC', 'All participant signatures verified and tactical data synced.')}
                        style={{ marginTop: 20 }}
                        icon={<Ionicons name="shield-checkmark-outline" size={18} color={Colors.background} />}
                    />
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
    title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
    subtitle: { color: Colors.accent, fontSize: 10, letterSpacing: 2, marginTop: 4, fontWeight: 'bold', fontFamily: 'monospace' },

    container: { padding: 20 },

    summaryCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        marginBottom: 24
    },
    summaryItem: { flex: 1, alignItems: 'center' },
    summaryLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
    summaryValue: { color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
    divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 16 },

    sectionTitle: { color: Colors.textSecondary, fontSize: 12, fontWeight: '900', marginBottom: 16, letterSpacing: 2, fontFamily: 'monospace' },

    participantCard: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.02)' },
    participantRow: { flexDirection: 'row', alignItems: 'center', padding: 12 },
    index: { color: Colors.textMuted, fontSize: 12, fontWeight: 'bold', width: 30, fontFamily: 'monospace' },
    mainInfo: { flex: 1 },
    identity: { flexDirection: 'row', alignItems: 'center' },
    name: { color: Colors.textPrimary, fontSize: 15, fontWeight: 'bold' },
    id: { color: Colors.textMuted, fontSize: 10, marginTop: 2, fontFamily: 'monospace' },

    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    errorText: { color: Colors.danger, fontSize: 18, fontWeight: 'bold', letterSpacing: 2, fontFamily: 'monospace' },
    backLink: { color: Colors.primary, marginTop: 20, textDecorationLine: 'underline', fontWeight: 'bold' },

    emptyState: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
    emptyText: { color: Colors.textMuted, fontSize: 12, marginTop: 16, fontWeight: 'bold', letterSpacing: 1, fontFamily: 'monospace' },

    rowActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    banBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(239, 68, 68, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
    unbanBtn: { backgroundColor: 'rgba(34, 197, 94, 0.1)', borderColor: 'rgba(34, 197, 94, 0.2)' },
});
