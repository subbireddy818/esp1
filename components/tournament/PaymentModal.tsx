import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { Button } from '@/components/ui/Button';

interface PaymentModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
    tournamentTitle: string;
    type: 'solo' | 'duo' | 'squad';
}

type PaymentMethod = 'upi' | 'paytm' | 'phonepe' | 'gpay';

export function PaymentModal({ visible, onClose, onSuccess, amount, tournamentTitle, type }: PaymentModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [upiId, setUpiId] = useState('');
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');

    const methods: { id: PaymentMethod; label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
        { id: 'upi', label: 'UPI ID', icon: 'link', color: '#6739B7' },
        { id: 'gpay', label: 'Google Pay', icon: 'logo-google', color: '#4285F4' },
        { id: 'phonepe', label: 'PhonePe', icon: 'phone-portrait', color: '#5F259F' },
        { id: 'paytm', label: 'Paytm', icon: 'wallet', color: '#00BAF2' },
    ];

    const handlePay = async () => {
        setProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        setProcessing(false);
        setStep('success');
        setTimeout(() => {
            onSuccess();
            resetState();
        }, 1500);
    };

    const resetState = () => {
        setSelectedMethod(null);
        setUpiId('');
        setProcessing(false);
        setStep('select');
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="slide" onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>SECURE PAYMENT</Text>
                            <Text style={styles.subtitle}>{tournamentTitle}</Text>
                        </View>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color={Colors.textMuted} />
                        </TouchableOpacity>
                    </View>

                    {/* Amount Card */}
                    <View style={styles.amountCard}>
                        <View style={styles.amountRow}>
                            <Text style={styles.amountLabel}>Entry Fee ({type.toUpperCase()})</Text>
                            <Text style={styles.amountValue}>₹{amount}</Text>
                        </View>
                        <View style={styles.amountDivider} />
                        <View style={styles.amountRow}>
                            <Text style={styles.amountLabel}>Platform Fee</Text>
                            <Text style={styles.freeText}>FREE</Text>
                        </View>
                        <View style={styles.amountDivider} />
                        <View style={styles.amountRow}>
                            <Text style={styles.totalLabel}>TOTAL</Text>
                            <Text style={styles.totalValue}>₹{amount}</Text>
                        </View>
                    </View>

                    {step === 'select' && (
                        <ScrollView style={styles.content}>
                            <Text style={styles.sectionLabel}>SELECT PAYMENT METHOD</Text>
                            {methods.map((m) => (
                                <TouchableOpacity
                                    key={m.id}
                                    style={[styles.methodRow, selectedMethod === m.id && styles.methodActive]}
                                    onPress={() => setSelectedMethod(m.id)}
                                >
                                    <View style={[styles.methodIcon, { backgroundColor: `${m.color}22` }]}>
                                        <Ionicons name={m.icon} size={20} color={m.color} />
                                    </View>
                                    <Text style={styles.methodLabel}>{m.label}</Text>
                                    <View style={[styles.radio, selectedMethod === m.id && styles.radioActive]}>
                                        {selectedMethod === m.id && <View style={styles.radioDot} />}
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {selectedMethod === 'upi' && (
                                <View style={styles.upiSection}>
                                    <Text style={styles.inputLabel}>Enter UPI ID</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={upiId}
                                        onChangeText={setUpiId}
                                        placeholder="yourname@upi"
                                        placeholderTextColor={Colors.textMuted}
                                        autoCapitalize="none"
                                    />
                                </View>
                            )}
                        </ScrollView>
                    )}

                    {step === 'confirm' && (
                        <View style={styles.confirmSection}>
                            {processing ? (
                                <View style={styles.processingBox}>
                                    <ActivityIndicator size="large" color={Colors.primary} />
                                    <Text style={styles.processingText}>Processing payment...</Text>
                                    <Text style={styles.processingHint}>Do not close this screen</Text>
                                </View>
                            ) : null}
                        </View>
                    )}

                    {step === 'success' && (
                        <View style={styles.successSection}>
                            <View style={styles.successIcon}>
                                <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
                            </View>
                            <Text style={styles.successTitle}>PAYMENT SUCCESSFUL</Text>
                            <Text style={styles.successSub}>₹{amount} paid • Registering you now...</Text>
                        </View>
                    )}

                    {/* Footer */}
                    {step === 'select' && (
                        <View style={styles.footer}>
                            <View style={styles.secureRow}>
                                <Ionicons name="lock-closed" size={14} color={Colors.success} />
                                <Text style={styles.secureText}>256-bit SSL Encrypted Payment</Text>
                            </View>
                            <Button
                                title={`PAY ₹${amount}`}
                                onPress={() => { setStep('confirm'); handlePay(); }}
                                fullWidth
                                size="lg"
                                disabled={!selectedMethod || (selectedMethod === 'upi' && !upiId.includes('@'))}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    container: {
        backgroundColor: Colors.card, borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl, maxHeight: '85%', padding: Spacing.lg,
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
    title: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold, letterSpacing: 1 },
    subtitle: { color: Colors.textMuted, fontSize: FontSizes.sm, marginTop: 2 },

    amountCard: {
        backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
        padding: Spacing.base, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.border,
    },
    amountRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
    amountLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm },
    amountValue: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.bold },
    freeText: { color: Colors.success, fontSize: FontSizes.md, fontWeight: FontWeights.bold },
    amountDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
    totalLabel: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.extrabold },
    totalValue: { color: Colors.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.extrabold },

    content: { flex: 1 },
    sectionLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: FontWeights.bold, letterSpacing: 1.5, marginBottom: Spacing.md },

    methodRow: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm,
        borderWidth: 1, borderColor: Colors.border,
    },
    methodActive: { borderColor: Colors.primary, backgroundColor: 'rgba(0,245,255,0.05)' },
    methodIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
    methodLabel: { flex: 1, color: Colors.textPrimary, fontWeight: FontWeights.semibold, fontSize: FontSizes.md },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
    radioActive: { borderColor: Colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

    upiSection: { marginTop: Spacing.md },
    inputLabel: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginBottom: Spacing.xs },
    input: {
        backgroundColor: Colors.surface, borderRadius: BorderRadius.md,
        borderWidth: 1, borderColor: Colors.border, color: Colors.textPrimary,
        paddingHorizontal: Spacing.md, height: 48, fontSize: FontSizes.md,
    },

    confirmSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: Spacing.xl },
    processingBox: { alignItems: 'center', gap: Spacing.md },
    processingText: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
    processingHint: { color: Colors.textMuted, fontSize: FontSizes.sm },

    successSection: { alignItems: 'center', paddingVertical: Spacing.xl },
    successIcon: { marginBottom: Spacing.md },
    successTitle: { color: Colors.success, fontSize: FontSizes.xl, fontWeight: FontWeights.extrabold, letterSpacing: 1 },
    successSub: { color: Colors.textSecondary, fontSize: FontSizes.sm, marginTop: Spacing.xs },

    footer: { paddingTop: Spacing.md },
    secureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: Spacing.md },
    secureText: { color: Colors.success, fontSize: 11, fontWeight: FontWeights.medium },
});
