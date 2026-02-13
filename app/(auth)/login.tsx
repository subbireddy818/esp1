import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading } = useAuth(); // Use AuthContext

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('ACCESS DENIED', 'Credentials required for uplink.');
            return;
        }

        const success = await login(email, password);

        if (success) {
            const ml = email.toLowerCase();
            // In a real app, we check user.role from context, but here we can just route
            if (ml === 'admin@sys.com') {
                router.replace('/admin/dashboard');
            } else if (ml === 'creator@sys.com') {
                router.replace('/creator/dashboard');
            } else {
                router.replace('/(tabs)');
            }
        } else {
            Alert.alert('AUTHENTICATION FAILED', 'Invalid credentials. Access denied.');
        }
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    {/* Header / Logo */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
                        </View>
                        <Text style={styles.title}>BATTLEZONE</Text>
                        <Text style={styles.subtitle}>TACTICAL OPERATIONS TERMINAL</Text>
                    </View>

                    {/* Login Form */}
                    <TacticalCard variant="default">
                        <View style={styles.form}>
                            <View style={styles.formHeader}>
                                <Text style={styles.formTitle}>IDENTITY VERIFICATION</Text>
                                <View style={styles.statusDot} />
                            </View>

                            <Input
                                label="EMAIL"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                icon={<Ionicons name="card-outline" size={20} color={Colors.textMuted} />}
                            />

                            <Input
                                label="PASSWORD"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                icon={<Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} />}
                            />

                            <Button
                                title="LOGIN"
                                onPress={handleLogin}
                                loading={isLoading}
                                fullWidth
                                size="lg"
                                style={styles.loginBtn}
                            />

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>OR AUTHENTICATE WITH</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <View style={styles.socialRow}>
                                <ScaleButton style={styles.socialBtn} onPress={() => Alert.alert('GOOGLE', 'Google Auth Simulation')}>
                                    <Ionicons name="logo-google" size={24} color={Colors.textPrimary} />
                                </ScaleButton>
                                <ScaleButton style={styles.socialBtn} onPress={() => Alert.alert('APPLE', 'Apple Auth Simulation')}>
                                    <Ionicons name="logo-apple" size={24} color={Colors.textPrimary} />
                                </ScaleButton>
                            </View>

                            <View style={styles.footerRow}>
                                <Text style={styles.footerText}>NEW OPERATOR?</Text>
                                <ScaleButton onPress={() => router.push('/(auth)/register')}>
                                    <Text style={styles.linkText}>ESTABLISH ID</Text>
                                </ScaleButton>
                            </View>

                            <View style={styles.hints}>
                                <Text style={styles.hintText}>SYSTEM DEMO CREDENTIALS:</Text>
                                <Text style={styles.hintCode}>admin@sys.com // admin</Text>
                                <Text style={styles.hintCode}>creator@sys.com // creator</Text>
                                <Text style={styles.hintCode}>user@sys.com // user</Text>
                            </View>
                        </View>
                    </TacticalCard>

                    <Text style={styles.version}>SYS.VER.2.0.4 [STABLE]</Text>
                </View >
            </KeyboardAvoidingView >
        </GradientBackground >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },

    header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
    logoContainer: {
        width: 80, height: 80, borderRadius: 20,
        backgroundColor: 'rgba(234,179,8,0.1)',
        borderWidth: 1, borderColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: Spacing.lg
    },
    title: { fontSize: 32, fontWeight: '900', color: Colors.textPrimary, letterSpacing: 4, fontFamily: 'monospace' },
    subtitle: { fontSize: 10, color: Colors.primary, letterSpacing: 2, marginTop: 8, fontWeight: 'bold' },

    form: { gap: Spacing.lg },
    formHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
    formTitle: { color: Colors.textMuted, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
    statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success, boxShadow: '0 0 10px #22c55e' },

    loginBtn: { marginTop: Spacing.sm },

    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.lg },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: { marginHorizontal: Spacing.md, color: Colors.textMuted, fontSize: 10, fontWeight: 'bold' },

    socialRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.lg, marginBottom: Spacing.lg },
    socialBtn: {
        width: 50, height: 50, borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: Colors.border,
        alignItems: 'center', justifyContent: 'center',
    },

    footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    footerText: { color: Colors.textSecondary, fontSize: FontSizes.sm },
    linkText: { color: Colors.primary, fontWeight: 'bold', fontSize: FontSizes.sm, letterSpacing: 1 },

    hints: { marginTop: Spacing.xl, padding: Spacing.md, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border },
    hintText: { color: Colors.textMuted, fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
    hintCode: { color: Colors.textAccent, fontSize: 10, fontFamily: 'monospace' },

    version: { position: 'absolute', bottom: 40, alignSelf: 'center', color: Colors.textMuted, fontSize: 10, fontFamily: 'monospace', opacity: 0.5 },
});
