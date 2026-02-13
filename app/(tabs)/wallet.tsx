import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { currentUser, mockTransactions } from '@/services/mockData';

export default function WalletScreen() {
    return (
        <GradientBackground>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="WALLET" />

                {/* Balance Card */}
                <View style={styles.balanceSection}>
                    <LinearGradient
                        colors={['rgba(0, 245, 255, 0.12)', 'rgba(191, 0, 255, 0.08)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.balanceCard}
                    >
                        <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
                        <Text style={styles.balanceAmount}>₹{currentUser.walletBalance.toLocaleString()}</Text>
                        <View style={styles.balanceActions}>
                            <Button title="Add Money" onPress={() => { }} size="sm" icon={<Ionicons name="add" size={16} color={Colors.background} />} />
                            <Button title="Withdraw" onPress={() => { }} size="sm" variant="outline" icon={<Ionicons name="arrow-up" size={16} color={Colors.primary} />} />
                        </View>
                    </LinearGradient>
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    <WalletStat icon="trending-up" label="Total Won" value="₹12,500" color={Colors.success} />
                    <WalletStat icon="trending-down" label="Total Spent" value="₹4,200" color={Colors.danger} />
                    <WalletStat icon="gift" label="Rewards" value="₹800" color={Colors.accent} />
                </View>

                {/* Daily Spin */}
                <View style={styles.section}>
                    <TouchableOpacity activeOpacity={0.85}>
                        <LinearGradient
                            colors={[...Colors.gradientGold]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.spinCard}
                        >
                            <Ionicons name="gift" size={32} color="#000" />
                            <View style={styles.spinText}>
                                <Text style={styles.spinTitle}>Daily Spin</Text>
                                <Text style={styles.spinSub}>Win up to ₹500 daily!</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#000" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Transactions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>TRANSACTIONS</Text>
                    {mockTransactions.map((tx) => (
                        <View key={tx.id} style={styles.txRow}>
                            <View style={[styles.txIcon, { backgroundColor: tx.type === 'credit' ? 'rgba(0,255,136,0.12)' : 'rgba(255,59,92,0.12)' }]}>
                                <Ionicons
                                    name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                                    size={18}
                                    color={tx.type === 'credit' ? Colors.success : Colors.danger}
                                />
                            </View>
                            <View style={styles.txInfo}>
                                <Text style={styles.txDesc}>{tx.description}</Text>
                                <Text style={styles.txDate}>
                                    {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    {tx.status === 'pending' && (
                                        <Text style={{ color: Colors.warning }}> • Pending</Text>
                                    )}
                                </Text>
                            </View>
                            <Text style={[styles.txAmount, { color: tx.type === 'credit' ? Colors.success : Colors.danger }]}>
                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
        </GradientBackground>
    );
}

function WalletStat({ icon, label, value, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; color: string }) {
    return (
        <View style={styles.wStat}>
            <View style={[styles.wStatIcon, { backgroundColor: `${color}18` }]}>
                <Ionicons name={icon} size={18} color={color} />
            </View>
            <Text style={styles.wStatValue}>{value}</Text>
            <Text style={styles.wStatLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    balanceSection: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.lg,
    },
    balanceCard: {
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        borderColor: Colors.borderAccent,
        padding: Spacing.xl,
        alignItems: 'center',
    },
    balanceLabel: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
        letterSpacing: 2,
        marginBottom: Spacing.sm,
    },
    balanceAmount: {
        ...TextStyles.h1,
        color: Colors.primary,
        marginBottom: Spacing.lg,
    },
    balanceActions: {
        flexDirection: 'row',
        gap: Spacing.md,
    },

    quickStats: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    wStat: {
        flex: 1,
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.md,
        alignItems: 'center',
    },
    wStatIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    wStatValue: {
        color: Colors.textPrimary,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.extrabold,
    },
    wStatLabel: {
        color: Colors.textMuted,
        fontSize: 9,
        fontWeight: FontWeights.bold,
        letterSpacing: 0.5,
        marginTop: 2,
    },

    section: {
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        color: Colors.textPrimary,
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.bold,
        letterSpacing: 1.5,
        marginBottom: Spacing.md,
    },

    spinCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.lg,
        padding: Spacing.base,
        gap: Spacing.md,
    },
    spinText: { flex: 1 },
    spinTitle: {
        color: '#000',
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.extrabold,
    },
    spinSub: {
        color: 'rgba(0,0,0,0.6)',
        fontSize: FontSizes.sm,
    },

    txRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: Spacing.md,
    },
    txIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    txInfo: { flex: 1 },
    txDesc: {
        color: Colors.textPrimary,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    txDate: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        marginTop: 2,
    },
    txAmount: {
        fontSize: FontSizes.base,
        fontWeight: FontWeights.extrabold,
    },
});
