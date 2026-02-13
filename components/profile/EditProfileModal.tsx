import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { currentUser } from '@/services/mockData';

interface EditProfileModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: { gameName: string; bio: string }) => void;
}

export function EditProfileModal({ visible, onClose, onSave }: EditProfileModalProps) {
    const [gameName, setGameName] = useState(currentUser.gameName || '');
    const [bio, setBio] = useState('Esports enthusiast ready to dominate!'); // Mock bio

    const handleSave = () => {
        onSave({ gameName, bio });
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
            <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>EDIT PROFILE</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Avatar Section */}
                        <View style={styles.avatarSection}>
                            <Avatar size="xl" tier={currentUser.tier} />
                            <TouchableOpacity style={styles.changeAvatarBtn}>
                                <Ionicons name="camera" size={16} color={Colors.background} />
                                <Text style={styles.changeAvatarText}>CHANGE</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Fields */}
                        <View style={styles.form}>
                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>IN-GAME NAME (IGN)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={gameName}
                                    onChangeText={setGameName}
                                    placeholder="Enter your IGN"
                                    placeholderTextColor={Colors.textMuted}
                                />
                            </View>

                            <View style={styles.fieldGroup}>
                                <Text style={styles.label}>BIO</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={bio}
                                    onChangeText={setBio}
                                    placeholder="Tell us about yourself"
                                    placeholderTextColor={Colors.textMuted}
                                    multiline
                                    maxLength={100}
                                />
                                <Text style={styles.charCount}>{bio.length}/100</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Button title="SAVE CHANGES" onPress={handleSave} fullWidth size="lg" />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    container: {
        backgroundColor: Colors.card,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        height: '80%',
        padding: Spacing.lg,
    },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, letterSpacing: 1 },

    avatarSection: { alignItems: 'center', marginBottom: Spacing.xl },
    changeAvatarBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
        marginTop: -15, borderWidth: 2, borderColor: Colors.card,
    },
    changeAvatarText: { color: Colors.background, fontSize: 10, fontWeight: FontWeights.bold },

    form: { gap: Spacing.lg },
    fieldGroup: {},
    label: { color: Colors.textMuted, fontSize: 10, fontWeight: FontWeights.bold, letterSpacing: 1, marginBottom: 6 },
    input: {
        backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
        borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary,
        paddingHorizontal: Spacing.md, height: 48, fontSize: FontSizes.md,
    },
    textArea: { height: 100, paddingTop: Spacing.md, textAlignVertical: 'top' },
    charCount: { color: Colors.textMuted, fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },

    footer: { marginTop: Spacing.xl },
});
