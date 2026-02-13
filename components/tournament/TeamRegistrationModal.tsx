import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export interface MemberInfo {
    name: string;
    phone: string;
    gameUid: string;
    gameName: string;
}

interface TeamRegistrationModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (teamName: string, members: MemberInfo[]) => void;
    type: 'duo' | 'squad';
}

export function TeamRegistrationModal({ visible, onClose, onSubmit, type }: TeamRegistrationModalProps) {
    const [teamName, setTeamName] = useState('');
    // Duo: 1 teammate + 1 sub = 2 members; Squad: 3 teammates + 1 sub = 4 members
    const totalSlots = type === 'duo' ? 2 : 4;
    const mainSlots = type === 'duo' ? 1 : 3;

    const emptyMember = (): MemberInfo => ({ name: '', phone: '', gameUid: '', gameName: '' });
    const [members, setMembers] = useState<MemberInfo[]>(
        Array.from({ length: totalSlots }, () => emptyMember())
    );

    const updateMember = (index: number, field: keyof MemberInfo, value: string) => {
        const updated = [...members];
        if (field === 'phone' || field === 'gameUid') {
            updated[index][field] = value.replace(/[^0-9]/g, '');
        } else {
            updated[index][field] = value;
        }
        setMembers(updated);
    };

    const isMemberValid = (m: MemberInfo): boolean => {
        return m.name.trim().length >= 2 && m.phone.length === 10 && m.gameUid.length >= 6 && m.gameName.trim().length >= 2;
    };

    const areMainMembersValid = members.slice(0, mainSlots).every(isMemberValid);
    const isSubValid = isMemberValid(members[members.length - 1]);
    const canSubmit = teamName.trim().length >= 2 && areMainMembersValid;
    // Substitute is optional, so canSubmit doesn't require sub

    const handleSubmit = () => {
        // Check for duplicate UIDs
        const uids = members.filter(m => m.gameUid).map(m => m.gameUid);
        const uniqueUids = new Set(uids);
        if (uniqueUids.size !== uids.length) {
            Alert.alert('Duplicate UID', 'Each player must have a unique Game UID.');
            return;
        }

        // Check for duplicate phones
        const phones = members.filter(m => m.phone).map(m => m.phone);
        const uniquePhones = new Set(phones);
        if (uniquePhones.size !== phones.length) {
            Alert.alert('Duplicate Phone', 'Each player must have a unique phone number.');
            return;
        }

        const validMembers = members.filter(m => m.gameUid.length > 0);
        onSubmit(teamName, validMembers);
    };

    const handleClose = () => {
        setTeamName('');
        setMembers(Array.from({ length: totalSlots }, () => emptyMember()));
        onClose();
    };

    const getMemberLabel = (index: number): { title: string; tag: string; tagColor: string } => {
        if (index < mainSlots) {
            return { title: `Teammate ${index + 1}`, tag: 'MAIN', tagColor: Colors.primary };
        }
        return { title: 'Substitute Player', tag: 'SUB', tagColor: Colors.warning };
    };

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>
                                {type === 'duo' ? 'DUO REGISTRATION' : 'SQUAD REGISTRATION'}
                            </Text>
                            <Text style={styles.subtitle}>
                                {type === 'duo' ? '1 Teammate + 1 Substitute' : '3 Teammates + 1 Substitute'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Team Name */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>TEAM NAME</Text>
                            <TextInput
                                style={styles.input}
                                value={teamName}
                                onChangeText={setTeamName}
                                placeholder="Enter your team name"
                                placeholderTextColor={Colors.textMuted}
                                maxLength={20}
                            />
                        </View>

                        {/* Captain (Pre-filled — You) */}
                        <View style={styles.memberCard}>
                            <View style={styles.memberHeader}>
                                <Text style={styles.memberTitle}>You (Captain)</Text>
                                <View style={[styles.tag, { backgroundColor: `${Colors.success}22` }]}>
                                    <Text style={[styles.tagText, { color: Colors.success }]}>CAPTAIN</Text>
                                </View>
                            </View>
                            <View style={styles.prefilled}>
                                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                                <Text style={styles.prefilledText}>Auto-filled from your profile (UID & Game Name)</Text>
                            </View>
                        </View>

                        {/* Team Members */}
                        {members.map((member, index) => {
                            const info = getMemberLabel(index);
                            const isSubstitute = index >= mainSlots;

                            return (
                                <View key={index} style={[styles.memberCard, isSubstitute && styles.subCard]}>
                                    <View style={styles.memberHeader}>
                                        <Text style={styles.memberTitle}>{info.title}</Text>
                                        <View style={[styles.tag, { backgroundColor: `${info.tagColor}22` }]}>
                                            <Text style={[styles.tagText, { color: info.tagColor }]}>{info.tag}</Text>
                                        </View>
                                    </View>
                                    {isSubstitute && (
                                        <Text style={styles.optionalLabel}>Optional — fills in if a main player can't join</Text>
                                    )}

                                    <View style={styles.fieldRow}>
                                        <View style={styles.fieldHalf}>
                                            <Text style={styles.inputLabel}>Player Name</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={member.name}
                                                onChangeText={(v) => updateMember(index, 'name', v)}
                                                placeholder="Real name"
                                                placeholderTextColor={Colors.textMuted}
                                                maxLength={25}
                                            />
                                        </View>
                                        <View style={styles.fieldHalf}>
                                            <Text style={styles.inputLabel}>Phone Number</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={member.phone}
                                                onChangeText={(v) => updateMember(index, 'phone', v)}
                                                placeholder="10-digit number"
                                                placeholderTextColor={Colors.textMuted}
                                                keyboardType="phone-pad"
                                                maxLength={10}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.fieldRow}>
                                        <View style={styles.fieldHalf}>
                                            <Text style={styles.inputLabel}>Game UID</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={member.gameUid}
                                                onChangeText={(v) => updateMember(index, 'gameUid', v)}
                                                placeholder="Free Fire UID"
                                                placeholderTextColor={Colors.textMuted}
                                                keyboardType="numeric"
                                                maxLength={12}
                                            />
                                        </View>
                                        <View style={styles.fieldHalf}>
                                            <Text style={styles.inputLabel}>In-Game Name</Text>
                                            <TextInput
                                                style={styles.input}
                                                value={member.gameName}
                                                onChangeText={(v) => updateMember(index, 'gameName', v)}
                                                placeholder="IGN"
                                                placeholderTextColor={Colors.textMuted}
                                                maxLength={20}
                                            />
                                        </View>
                                    </View>

                                    {/* Validation indicator */}
                                    {!isSubstitute && member.gameUid.length > 0 && (
                                        <View style={styles.validRow}>
                                            <Ionicons
                                                name={isMemberValid(member) ? 'checkmark-circle' : 'alert-circle'}
                                                size={14}
                                                color={isMemberValid(member) ? Colors.success : Colors.warning}
                                            />
                                            <Text style={[styles.validText, { color: isMemberValid(member) ? Colors.success : Colors.warning }]}>
                                                {isMemberValid(member) ? 'All fields valid' : 'Please fill all fields correctly'}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            );
                        })}

                        <View style={{ height: 20 }} />
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Button
                            title="PROCEED TO PAYMENT"
                            onPress={handleSubmit}
                            fullWidth
                            size="lg"
                            disabled={!canSubmit}
                            icon={<Ionicons name="card" size={18} color={Colors.background} />}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    container: {
        backgroundColor: Colors.card, borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl, height: '90%', paddingTop: Spacing.lg, paddingHorizontal: Spacing.lg,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
    title: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, letterSpacing: 1 },
    subtitle: { color: Colors.textMuted, fontSize: FontSizes.sm, marginTop: 2 },

    content: { flex: 1 },

    fieldGroup: { marginBottom: Spacing.lg },
    fieldLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: FontWeights.bold, letterSpacing: 1.5, marginBottom: Spacing.xs },
    input: {
        backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
        borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary,
        paddingHorizontal: Spacing.md, height: 44, fontSize: FontSizes.sm,
    },

    memberCard: {
        backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
        padding: Spacing.base, marginBottom: Spacing.md, borderWidth: 1, borderColor: Colors.border,
    },
    subCard: { borderColor: `${Colors.warning}44`, borderStyle: 'dashed' },
    memberHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
    memberTitle: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.bold },
    tag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    tagText: { fontSize: 9, fontWeight: FontWeights.extrabold, letterSpacing: 1 },

    prefilled: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    prefilledText: { color: Colors.textMuted, fontSize: FontSizes.xs },

    optionalLabel: { color: Colors.warning, fontSize: 10, marginBottom: Spacing.sm, fontStyle: 'italic' },

    fieldRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
    fieldHalf: { flex: 1 },
    inputLabel: { color: Colors.textSecondary, fontSize: 10, fontWeight: FontWeights.semibold, marginBottom: 4 },

    validRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    validText: { fontSize: 11, fontWeight: FontWeights.medium },

    footer: { paddingVertical: Spacing.md },
});
