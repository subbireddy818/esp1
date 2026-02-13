import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { ScaleButton } from '@/components/ui/ScaleButton';

export default function EditTournament() {
    const { id } = useLocalSearchParams();
    const [title, setTitle] = useState(id === 't1' ? 'Cyber Weekend Showdown' : 'Midnight Solo Cup');
    const [prize, setPrize] = useState(id === 't1' ? '5000' : '1500');
    const [slots, setSlots] = useState(id === 't1' ? '48' : '100');

    const handleUpdate = () => {
        Alert.alert('SYSTEM UPDATE', 'Tournament parameters successfully modified and synced.');
        router.back();
    };

    const handleCancel = () => {
        Alert.alert('WARNING', 'Discard unsaved modifications?', [
            { text: 'KEEP EDITING', style: 'cancel' },
            { text: 'DISCARD', style: 'destructive', onPress: () => router.back() }
        ]);
    };

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <ScaleButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.title}>EDIT DEPLOYMENT</Text>
                        <Text style={styles.subtitle}>UNIT ID: {id?.toString().toUpperCase()}</Text>
                    </View>
                </View>

                <TacticalCard style={styles.formCard}>
                    <Text style={styles.sectionTitle}>CORE PARAMETERS</Text>

                    <Input
                        label="TOURNAMENT TITLE"
                        value={title}
                        onChangeText={setTitle}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 12 }}>
                            <Input
                                label="PRIZE POOL (₹)"
                                value={prize}
                                onChangeText={setPrize}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Input
                                label="TOTAL SLOTS"
                                value={slots}
                                onChangeText={setSlots}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.alertBox}>
                        <Ionicons name="information-circle-outline" size={20} color={Colors.info} />
                        <Text style={styles.alertText}>Changes reflect instantly across all participant terminals.</Text>
                    </View>
                </TacticalCard>

                <View style={styles.actions}>
                    <Button title="SYNC DEPLOYMENT" onPress={handleUpdate} size="lg" />
                    <Button title="ABORT CHANGES" variant="outline" onPress={handleCancel} size="lg" style={{ marginTop: 12 }} />
                </View>

                <TacticalCard variant="highlight" style={{ marginTop: 24 }}>
                    <Text style={styles.dangerTitle}>CRITICAL ACTIONS</Text>
                    <Text style={styles.dangerDesc}>Permanently terminate this deployment and refund participants.</Text>
                    <Button title="TERMINATE TOURNAMENT" variant="danger" onPress={() => Alert.alert('TERMINATE', 'Confirm total termination?')} style={{ borderColor: Colors.danger }} />
                </TacticalCard>
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 60 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
    subtitle: { color: Colors.primary, fontSize: 10, letterSpacing: 2, marginTop: 4, fontWeight: 'bold' },

    formCard: { padding: 16 },
    sectionTitle: { color: Colors.textSecondary, fontSize: 12, fontWeight: 'bold', marginBottom: 20, letterSpacing: 1 },
    row: { flexDirection: 'row', alignItems: 'center' },

    alertBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 12, borderRadius: 8, marginTop: 12 },
    alertText: { color: Colors.info, fontSize: 11, marginLeft: 10, flex: 1 },

    actions: { marginTop: 32 },

    dangerTitle: { color: Colors.danger, fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
    dangerDesc: { color: Colors.textSecondary, fontSize: 12, marginBottom: 16 },
});
