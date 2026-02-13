import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { mockUsers, User } from '@/services/mockData';
import { Spacing } from '@/constants/spacing';
import { ScaleButton } from '@/components/ui/ScaleButton';

export default function UserDatabase() {
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Filter users based on search
    const filteredUsers = mockUsers.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.uid.includes(search)
    );

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
    };

    const handleAction = (label: string) => {
        Alert.alert('SYSTEM COMMAND', `Execution of [${label}] initiated for ${selectedUser?.username}.`);
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ScaleButton onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                    <View style={{ marginLeft: 16 }}>
                        <Text style={styles.title}>USER DATABASE</Text>
                        <Text style={styles.subtitle}>TOTAL RECORDS: {mockUsers.length}</Text>
                    </View>
                </View>

                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={Colors.textMuted} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search via ID, Alias, or Comms..."
                        placeholderTextColor={Colors.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <ScrollView contentContainerStyle={styles.list}>
                    {filteredUsers.map(user => (
                        <ScaleButton key={user.id} onPress={() => handleUserClick(user)}>
                            <TacticalCard style={styles.userCard} noPadding>
                                <View style={styles.cardContent}>
                                    <View style={[styles.avatar, { borderColor: user.role === 'admin' ? Colors.gold : Colors.primary }]}>
                                        <Text style={styles.avatarText}>{user.username[0]}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Text style={styles.username}>{user.username}</Text>
                                            <Text style={[styles.role, { color: user.role === 'admin' ? Colors.gold : Colors.textMuted }]}>
                                                {user.role?.toUpperCase() || 'OPERATOR'}
                                            </Text>
                                        </View>
                                        <Text style={styles.uid}>UID: {user.uid} // {user.email}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                                </View>
                            </TacticalCard>
                        </ScaleButton>
                    ))}
                    {filteredUsers.length === 0 && (
                        <Text style={styles.emptyText}>NO RECORDS FOUND</Text>
                    )}
                </ScrollView>

                {/* Dossier Modal */}
                <Modal
                    visible={!!selectedUser}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedUser(null)}
                >
                    <View style={styles.modalOverlay}>
                        <TacticalCard style={styles.dossierCard} noPadding>
                            <View style={styles.dossierHeader}>
                                <View>
                                    <Text style={styles.dossierTitle}>IDENTIFICATION: {selectedUser?.username.toUpperCase()}</Text>
                                    <Text style={styles.dossierStatus}>STATUS: {selectedUser?.kycVerified ? 'VERIFIED' : 'PENDING'}</Text>
                                </View>
                                <ScaleButton onPress={() => setSelectedUser(null)}>
                                    <View style={styles.closeBtn}>
                                        <Ionicons name="close" size={20} color={Colors.textPrimary} />
                                    </View>
                                </ScaleButton>
                            </View>

                            <ScrollView style={styles.dossierContent}>
                                <View style={styles.dossierSection}>
                                    <Text style={styles.sectionLabel}>CORE DATA</Text>
                                    <TacticalCard style={styles.dataBox}>
                                        <DataRow label="UID" value={selectedUser?.uid || ''} />
                                        <DataRow label="COMMS" value={selectedUser?.email || ''} />
                                        <DataRow label="WALLET" value={`₹${selectedUser?.walletBalance}`} color={Colors.success} />
                                        <DataRow label="TIER" value={selectedUser?.tier.toUpperCase() || ''} color={Colors.gold} />
                                    </TacticalCard>
                                </View>

                                <View style={styles.dossierSection}>
                                    <Text style={styles.sectionLabel}>COMBAT ARCHIVE</Text>
                                    <View style={styles.statsRow}>
                                        <MiniStat label="KILLS" value={selectedUser?.stats.totalKills.toString() || '0'} color={Colors.danger} />
                                        <MiniStat label="KD" value={selectedUser?.stats.squad.kda.toString() || '0'} color={Colors.primary} />
                                        <MiniStat label="WINS" value={selectedUser?.stats.totalBooyahs.toString() || '0'} color={Colors.success} />
                                    </View>
                                </View>

                                <View style={styles.dossierSection}>
                                    <Text style={styles.sectionLabel}>SQUAD INTEL</Text>
                                    <TacticalCard style={styles.dataBox}>
                                        <DataRow label="GUILD ID" value={selectedUser?.guildId || 'NONE'} />
                                    </TacticalCard>
                                </View>

                                <View style={styles.adminActions}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('RESTRICT ACCESS')}>
                                        <Text style={styles.actionBtnText}>RESTRICT ACCESS</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionBtn, { borderColor: Colors.danger }]} onPress={() => handleAction('TERMINATE ACCOUNT')}>
                                        <Text style={[styles.actionBtnText, { color: Colors.danger }]}>TERMINATE ACCOUNT</Text>
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
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 1, fontFamily: 'monospace' },
    subtitle: { fontSize: 10, color: Colors.primary, letterSpacing: 2, fontWeight: 'bold', fontFamily: 'monospace' },

    searchBar: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, marginBottom: 24,
        borderWidth: 1.5, borderColor: Colors.border
    },
    searchInput: { flex: 1, marginLeft: 12, color: Colors.textPrimary, fontFamily: 'monospace', fontSize: 13 },

    list: { gap: 12, paddingBottom: 60 },
    userCard: { marginBottom: 0, overflow: 'hidden' },
    cardContent: { padding: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },

    avatar: {
        width: 44, height: 44, borderRadius: 12,
        backgroundColor: Colors.surfaceLight, borderWidth: 1.5,
        alignItems: 'center', justifyContent: 'center'
    },
    avatarText: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 16 },
    username: { color: Colors.textPrimary, fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 },
    uid: { color: Colors.textMuted, fontSize: 10, fontFamily: 'monospace', marginTop: 2 },
    role: { fontSize: 9, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },

    emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontFamily: 'monospace', fontSize: 12, letterSpacing: 1 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
    dossierCard: { height: '80%', overflow: 'hidden', backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.borderAccent },
    dossierHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(234, 179, 8, 0.05)' },
    dossierTitle: { color: Colors.textPrimary, fontSize: 14, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
    dossierStatus: { color: Colors.primary, fontSize: 9, fontWeight: 'bold', marginTop: 4, letterSpacing: 1 },
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
    actionBtnText: { color: Colors.textSecondary, fontSize: 12, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
});
