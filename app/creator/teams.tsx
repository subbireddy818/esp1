import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { Button } from '@/components/ui/Button';
import { ScaleButton } from '@/components/ui/ScaleButton';

const mockTeams = [
    { id: '1', name: 'Shadow Legion', captain: 'ShadowStrike', status: 'verified' },
    { id: '2', name: 'Inferno Squad', captain: 'NightFury', status: 'flagged' },
    { id: '3', name: 'Thunder Bolt', captain: 'Zeus', status: 'verified' },
];

export default function ManageTeams() {
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <ScaleButton onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                    <Text style={styles.title}>ROSTER CONTROL</Text>
                    <Text style={styles.subtitle}>VERIFY & MANAGE TEAMS</Text>
                </View>

                {mockTeams.map(team => (
                    <TacticalCard key={team.id} style={{ marginBottom: 12 }}>
                        <View style={styles.row}>
                            <View style={[styles.statusIndicator, { backgroundColor: team.status === 'verified' ? Colors.success : Colors.warning }]} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.teamName}>{team.name}</Text>
                                <Text style={styles.captain}>CPT: {team.captain}</Text>
                            </View>
                            <Button
                                title={team.status === 'verified' ? "BAN" : "VERIFY"}
                                size="sm"
                                variant={team.status === 'verified' ? "ghost" : "primary"}
                                onPress={() => Alert.alert('ACTION', `Updated status for ${team.name}`)}
                            />
                        </View>
                    </TacticalCard>
                ))}
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 1, fontFamily: 'monospace' },
    subtitle: { fontSize: 10, color: Colors.accent, letterSpacing: 2, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    statusIndicator: { width: 4, height: 40, borderRadius: 2 },
    teamName: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 16 },
    captain: { color: Colors.textMuted, fontSize: 12, fontFamily: 'monospace' }
});
