import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { ScaleButton } from '@/components/ui/ScaleButton';

export default function CreateTournament() {
    const [title, setTitle] = useState('');
    const [map, setMap] = useState('');
    const [prize, setPrize] = useState('');

    const handleCreate = () => {
        Alert.alert('DEPLOYING', 'Tournament lobby initialized.', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <ScaleButton onPress={() => router.back()} style={{ marginBottom: 16 }}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                    <Text style={styles.title}>NEW DEPLOYMENT</Text>
                    <Text style={styles.subtitle}>CONFIGURE LOBBY SETTINGS</Text>
                </View>

                <TacticalCard>
                    <View style={styles.form}>
                        <Input label="TOURNAMENT TITLE" value={title} onChangeText={setTitle} />
                        <Input label="MAP (e.g. Bermuda)" value={map} onChangeText={setMap} />
                        <Input label="PRIZE POOL" value={prize} onChangeText={setPrize} keyboardType="numeric" />

                        <View style={{ gap: 8 }}>
                            <Text style={styles.label}>FORMAT</Text>
                            <View style={styles.formatRow}>
                                <Button title="SOLO" size="sm" variant="outline" onPress={() => { }} style={{ flex: 1 }} />
                                <Button title="DUO" size="sm" variant="outline" onPress={() => { }} style={{ flex: 1 }} />
                                <Button title="SQUAD" size="sm" variant="primary" onPress={() => { }} style={{ flex: 1 }} />
                            </View>
                        </View>

                        <Button title="INITIALIZE TOURNAMENT" onPress={handleCreate} size="lg" style={{ marginTop: 16 }} />
                    </View>
                </TacticalCard>
            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 1, fontFamily: 'monospace' },
    subtitle: { fontSize: 10, color: Colors.primary, letterSpacing: 2, fontWeight: 'bold' },
    form: { gap: 16 },
    label: { color: Colors.textMuted, fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
    formatRow: { flexDirection: 'row', gap: 8 }
});
