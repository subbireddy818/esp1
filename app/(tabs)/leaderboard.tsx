import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { mockUsers, TournamentFormat } from '@/services/mockData';

interface LeaderboardEntry {
    id: string;
    rank: number;
    username: string;
    gameName: string;
    wins: number;
    kills: number;
    kda: number;
    tier: string;
}

export default function LeaderboardScreen() {
    const [filter, setFilter] = useState<TournamentFormat>('squad');

    // Build leaderboard from mockUsers, sorted by wins in selected mode
    const leaderboard: LeaderboardEntry[] = mockUsers
        .map((u) => {
            const modeStats = u.stats?.[filter];
            return {
                id: u.id,
                rank: 0,
                username: u.username,
                gameName: u.gameName || u.username,
                wins: modeStats?.booyahs ?? 0,
                kills: modeStats?.kills ?? 0,
                kda: modeStats?.kda ?? 0,
                tier: u.tier,
            };
        })
        .sort((a, b) => b.wins - a.wins)
        .map((entry, i) => ({ ...entry, rank: i + 1 }));

    const getMedalColor = (rank: number) => {
        if (rank === 1) return Colors.tierGold;
        if (rank === 2) return '#C0C0C0';
        if (rank === 3) return '#CD7F32';
        return Colors.textMuted;
    };

    const renderItem = ({ item }: { item: LeaderboardEntry }) => {
        const isTop3 = item.rank <= 3;
        return (
            <View style={[styles.row, isTop3 && styles.rowTop3]}>
                {/* Rank */}
                <View style={[styles.rankBox, isTop3 && { backgroundColor: `${getMedalColor(item.rank)}22` }]}>
                    {isTop3 ? (
                        <Ionicons name="medal" size={20} color={getMedalColor(item.rank)} />
                    ) : (
                        <Text style={styles.rankNum}>{item.rank}</Text>
                    )}
                </View>

                {/* Player Info */}
                <Avatar size="sm" tier={item.tier as any} />
                <View style={styles.playerInfo}>
                    <Text style={styles.playerName} numberOfLines={1}>{item.gameName}</Text>
                    <Text style={styles.playerUsername}>@{item.username}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsCol}>
                    <Text style={[styles.statVal, isTop3 && { color: getMedalColor(item.rank) }]}>
                        {item.wins}
                    </Text>
                    <Text style={styles.statLabel}>WINS</Text>
                </View>
                <View style={styles.statsCol}>
                    <Text style={styles.statVal}>{item.kills}</Text>
                    <Text style={styles.statLabel}>KILLS</Text>
                </View>
            </View>
        );
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>LEADERBOARD</Text>
                    <Ionicons name="podium" size={24} color={Colors.primary} />
                </View>

                {/* Filter: Solo / Duo / Squad */}
                <View style={styles.filterRow}>
                    {(['solo', 'duo', 'squad'] as TournamentFormat[]).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterTab, filter === f && styles.filterTabActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                                {f.toUpperCase()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Top 3 Highlight */}
                {leaderboard.length >= 3 && (
                    <View style={styles.podium}>
                        {/* 2nd Place */}
                        <PodiumCard entry={leaderboard[1]} color="#C0C0C0" height={90} />
                        {/* 1st Place */}
                        <PodiumCard entry={leaderboard[0]} color={Colors.tierGold} height={110} crown />
                        {/* 3rd Place */}
                        <PodiumCard entry={leaderboard[2]} color="#CD7F32" height={75} />
                    </View>
                )}

                {/* Full List */}
                <FlatList
                    data={leaderboard}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </GradientBackground>
    );
}

function PodiumCard({ entry, color, height, crown }: { entry: LeaderboardEntry; color: string; height: number; crown?: boolean }) {
    return (
        <View style={[styles.podiumCard, { borderColor: `${color}44` }]}>
            {crown && (
                <Ionicons name="diamond" size={18} color={Colors.tierGold} style={styles.crown} />
            )}
            <Avatar size="sm" tier={entry.tier as any} />
            <Text style={[styles.podiumName, { color }]} numberOfLines={1}>{entry.gameName}</Text>
            <View style={[styles.podiumBar, { height, backgroundColor: `${color}22`, borderColor: `${color}55` }]}>
                <Text style={[styles.podiumRank, { color }]}>#{entry.rank}</Text>
                <Text style={styles.podiumWins}>{entry.wins}</Text>
                <Text style={styles.podiumWinsLabel}>WINS</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: Spacing.base, marginBottom: Spacing.lg,
    },
    headerTitle: { ...TextStyles.h2, color: Colors.textPrimary, letterSpacing: 2 },

    filterRow: {
        flexDirection: 'row', paddingHorizontal: Spacing.base,
        marginBottom: Spacing.lg, gap: Spacing.md, justifyContent: 'center',
    },
    filterTab: {
        paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    },
    filterTabActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    filterText: { color: Colors.textSecondary, fontWeight: FontWeights.bold, fontSize: FontSizes.sm },
    filterTextActive: { color: Colors.background },

    // Podium
    podium: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end',
        paddingHorizontal: Spacing.lg, marginBottom: Spacing.xl, gap: Spacing.sm,
    },
    podiumCard: {
        flex: 1, alignItems: 'center', backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg, borderWidth: 1, paddingTop: Spacing.md, paddingBottom: 0,
    },
    crown: { position: 'absolute', top: -10, zIndex: 1 },
    podiumName: { fontSize: 10, fontWeight: FontWeights.bold, marginTop: 4, marginBottom: 4 },
    podiumBar: {
        width: '100%', borderRadius: BorderRadius.md, borderWidth: 1,
        alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.sm, marginTop: 4,
    },
    podiumRank: { fontSize: FontSizes.lg, fontWeight: FontWeights.extrabold },
    podiumWins: { color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: FontWeights.extrabold },
    podiumWinsLabel: { color: Colors.textMuted, fontSize: 8, fontWeight: FontWeights.bold, letterSpacing: 1 },

    // List
    listContent: { paddingHorizontal: Spacing.base, paddingBottom: 80 },
    row: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.sm,
    },
    rowTop3: { backgroundColor: 'rgba(255,215,0,0.03)' },
    rankBox: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center',
    },
    rankNum: { color: Colors.textMuted, fontWeight: FontWeights.bold, fontSize: FontSizes.md },
    playerInfo: { flex: 1 },
    playerName: { color: Colors.textPrimary, fontWeight: FontWeights.bold, fontSize: FontSizes.md },
    playerUsername: { color: Colors.textMuted, fontSize: 11 },
    statsCol: { alignItems: 'center', minWidth: 44 },
    statVal: { color: Colors.textPrimary, fontWeight: FontWeights.extrabold, fontSize: FontSizes.base },
    statLabel: { color: Colors.textMuted, fontSize: 8, fontWeight: FontWeights.bold, letterSpacing: 0.5 },
});
