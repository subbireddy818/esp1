import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ViewStyle, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Badge } from './Badge';
import { Tournament } from '@/services/mockData';
import { TacticalCard } from './TacticalCard';
import { ScaleButton } from './ScaleButton';

interface TournamentCardProps {
    tournament: Tournament;
    onPress: (id: string) => void;
    style?: ViewStyle;
}

export function TournamentCard({ tournament, onPress, style }: TournamentCardProps) {
    const fillPercent = (tournament.currentPlayers / tournament.maxPlayers) * 100;
    const isFull = tournament.currentPlayers >= tournament.maxPlayers;
    const isLive = tournament.status === 'live';

    // Pulse animation for LIVE status
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isLive) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [isLive]);

    const statusConfig: Record<string, { variant: 'success' | 'danger' | 'primary' | 'warning' | 'info'; label: string }> = {
        upcoming: { variant: 'primary', label: 'UPCOMING' },
        live: { variant: 'success', label: 'LIVE' },
        completed: { variant: 'warning', label: 'COMPLETED' },
        cancelled: { variant: 'danger', label: 'CANCELLED' },
    };

    const status = statusConfig[tournament.status];

    return (
        <ScaleButton onPress={() => onPress(tournament.id)} style={style}>
            <TacticalCard variant={isLive ? 'highlight' : 'default'} noPadding>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <View style={styles.titleSection}>
                        <Text style={styles.title} numberOfLines={1}>
                            {tournament.title}
                        </Text>
                        <View style={styles.metaRow}>
                            <Badge
                                text={tournament.type.toUpperCase()}
                                variant="info"
                                size="sm"
                            />
                            <Text style={styles.map}>
                                <Ionicons name="map-outline" size={12} color={Colors.textMuted} />{' '}
                                {tournament.map}
                            </Text>
                        </View>
                    </View>

                    {/* Status Badge with Pulse if Live */}
                    <View>
                        <Badge
                            text={status.label}
                            variant={status.variant}
                            size="sm"
                        />
                        {isLive && (
                            <Animated.View style={[
                                styles.pulseRing,
                                { transform: [{ scale: pulseAnim }], opacity: pulseAnim.interpolate({ inputRange: [1, 1.2], outputRange: [0.5, 0] }) }
                            ]} />
                        )}
                    </View>
                </View>

                {/* Prize & Fee Row */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>PRIZE POOL</Text>
                        <Text style={[styles.statValue, isLive && { color: Colors.primary }]}>₹{tournament.prizePool}</Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>ENTRY FEE</Text>
                        <Text style={[styles.statValue, { color: tournament.entryFee === 0 ? Colors.success : Colors.textPrimary }]}>
                            {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
                        </Text>
                    </View>
                    <View style={styles.verticalDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>{isLive ? 'STARTED' : 'STARTS'}</Text>
                        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                            {new Date(tournament.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>

                {/* Slots Progress */}
                <View style={styles.slotSection}>
                    <View style={styles.slotHeader}>
                        <Text style={styles.slotText}>
                            <Text style={{ color: isFull ? Colors.danger : Colors.textPrimary, fontWeight: 'bold' }}>
                                {tournament.currentPlayers}
                            </Text>
                            /{tournament.maxPlayers} Registered
                        </Text>
                        <Text style={[styles.slotPercent, isFull && { color: Colors.danger }]}>
                            {Math.round(fillPercent)}%
                        </Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <LinearGradient
                            colors={isFull ? [...Colors.gradientDanger] : [...Colors.gradientPrimary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressFill, { width: `${Math.min(fillPercent, 100)}%` }]}
                        />
                    </View>
                </View>
            </TacticalCard>
        </ScaleButton>
    );
}

const styles = StyleSheet.create({
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
        padding: Spacing.md,
    },
    titleSection: { flex: 1, marginRight: Spacing.sm },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginBottom: 6,
        letterSpacing: 0.5,
        fontFamily: 'monospace', // Tech feel
    },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    map: { color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: FontWeights.medium },

    pulseRing: {
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: Colors.success, borderRadius: BorderRadius.full, zIndex: -1,
    },

    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderTopWidth: 1, borderBottomWidth: 1,
        borderColor: Colors.border,
        paddingVertical: Spacing.sm,
        marginBottom: Spacing.md,
    },
    statBox: { flex: 1, alignItems: 'center' },
    statLabel: {
        color: Colors.textMuted, fontSize: 8, fontWeight: FontWeights.bold, letterSpacing: 1, marginBottom: 2,
    },
    statValue: { color: Colors.textPrimary, fontSize: FontSizes.md, fontWeight: FontWeights.bold },
    verticalDivider: { width: 1, backgroundColor: Colors.border },

    slotSection: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
    slotHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    slotText: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: FontWeights.medium },
    slotPercent: { color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: FontWeights.bold },
    progressTrack: { height: 4, backgroundColor: Colors.surface, borderRadius: 2, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 2 },
});
