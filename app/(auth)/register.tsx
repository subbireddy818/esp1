import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { FontSizes } from '@/constants/typography';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { ScaleButton } from '@/components/ui/ScaleButton';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('MISSING DATA', 'All fields required for registration.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('ERROR', 'Access codes do not match.');
            return;
        }

        setIsLoading(true);
        // Simulate API
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('SUCCESS', 'Operator ID created. Initialize uplink.', [
                { text: 'LOGIN', onPress: () => router.replace('/(auth)/login') }
            ]);
        }, 1500);
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
                        <ScaleButton onPress={() => router.back()} style={styles.backBtn}>
                            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                        </ScaleButton>
                        <Text style={styles.title}>NEW OPERATOR</Text>
                        <Text style={styles.subtitle}>ESTABLISH NEURAL LINK</Text>
                    </View>

                    {/* Register Form */}
                    <TacticalCard variant="default">
                        <View style={styles.form}>
                            <Input
                                label="NAME"
                                value={name}
                                onChangeText={setName}
                                icon={<Ionicons name="person-outline" size={20} color={Colors.textMuted} />}
                            />

                            <Input
                                label="EMAIL"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon={<Ionicons name="mail-outline" size={20} color={Colors.textMuted} />}
                            />

                            <Input
                                label="PASSWORD"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                icon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />}
                            />

                            <Input
                                label="CONFIRM PASSWORD"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                icon={<Ionicons name="shield-checkmark-outline" size={20} color={Colors.textMuted} />}
                            />

                            <Button
                                title="REGISTER"
                                onPress={handleRegister}
                                loading={isLoading}
                                fullWidth
                                size="lg"
                                style={styles.registerBtn}
                            />

                            <View style={styles.footerRow}>
                                <Text style={styles.footerText}>ALREADY REGISTERED?</Text>
                                <ScaleButton onPress={() => router.replace('/(auth)/login')}>
                                    <Text style={styles.linkText}>LOGIN UPLINK</Text>
                                </ScaleButton>
                            </View>
                        </View>
                    </TacticalCard>
                </View>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },

    header: { alignItems: 'center', marginBottom: Spacing.xl },
    backBtn: { position: 'absolute', left: 0, top: 0, padding: 8 },
    title: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 3, fontFamily: 'monospace' },
    subtitle: { fontSize: 10, color: Colors.primary, letterSpacing: 2, marginTop: 4, fontWeight: 'bold' },

    form: { gap: Spacing.md },
    registerBtn: { marginTop: Spacing.sm },

    footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: Spacing.md },
    footerText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
    linkText: { color: Colors.primary, fontWeight: 'bold', fontSize: FontSizes.sm, letterSpacing: 1 },
});
