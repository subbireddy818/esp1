import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
    const [gameUID, setGameUID] = useState('');
    const [gameName, setGameName] = useState('');
    const [uidError, setUidError] = useState('');
    const [nameError, setNameError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRegister = async () => {
        let valid = true;

        if (!gameUID || gameUID.length < 6) {
            setUidError('Enter your Free Fire UID (6+ digits)');
            valid = false;
        } else {
            setUidError('');
        }

        if (!gameName || gameName.trim().length < 2) {
            setNameError('Enter your in-game name (2+ characters)');
            valid = false;
        } else {
            setNameError('');
        }

        if (!valid) return;

        setIsSubmitting(true);
        // Simulate saving — in future this calls backend
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsSubmitting(false);
        router.replace('/(tabs)');
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="game-controller" size={48} color={Colors.accent} />
                        </View>
                        <Text style={styles.title}>COMPLETE PROFILE</Text>
                        <Text style={styles.subtitle}>
                            Enter your Free Fire game details to finish registration.
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formSection}>
                        <Input
                            label="Free Fire UID"
                            value={gameUID}
                            onChangeText={(t) => { setGameUID(t.replace(/[^0-9]/g, '')); setUidError(''); }}
                            keyboardType="number-pad"
                            error={uidError}
                            icon={<Ionicons name="id-card-outline" size={20} color={Colors.textMuted} />}
                        />

                        <Input
                            label="In-Game Name"
                            value={gameName}
                            onChangeText={(t) => { setGameName(t); setNameError(''); }}
                            error={nameError}
                            icon={<Ionicons name="person-outline" size={20} color={Colors.textMuted} />}
                            autoCapitalize="none"
                        />

                        <View style={styles.helpBox}>
                            <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
                            <Text style={styles.helpText}>
                                Open Free Fire → Profile → Copy your UID and in-game name
                            </Text>
                        </View>

                        <Button
                            title="ENTER BATTLEZONE"
                            onPress={handleRegister}
                            loading={isSubmitting}
                            fullWidth
                            size="lg"
                            disabled={!gameUID || !gameName.trim()}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing['2xl'],
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing['3xl'],
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(191, 0, 255, 0.1)',
        borderWidth: 2,
        borderColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        ...TextStyles.h2,
        color: Colors.textPrimary,
        letterSpacing: 2,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.base,
        textAlign: 'center',
        maxWidth: 280,
    },
    formSection: {
        gap: Spacing.md,
    },
    helpBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
    },
    helpText: {
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
        flex: 1,
    },
});
