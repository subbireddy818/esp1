import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockGuilds, mockUsers, currentUser } from '@/services/mockData';

export default function GuildScreen() {
    const userGuild = mockGuilds.find(g => g.id === currentUser.guildId);

    return (
        <GradientBackground>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <ScreenHeader title="GUILD" subtitle="Rise together" />

                {userGuild ? (
                    <>
                        {/* Guild Card */}
                        <View style={styles.section}>
                            <Card variant="neon" padding={Spacing.lg}>
                                <View style={styles.guildHeader}>
                                    <View style={styles.guildAvatar}>
                                        <Text style={styles.guildTag}>{userGuild.tag}</Text>
                                    </View>
                                    <View style={styles.guildInfo}>
                                        <Text style={styles.guildName}>{userGuild.name}</Text>
                                        <Badge text={`Level ${userGuild.level}`} variant="primary" size="sm" />
                                    </View>
                                </View>

                                <View style={styles.guildStats}>
                                    <GuildStat label="MEMBERS" value={userGuild.members.length} />
                                    <GuildStat label="WINS" value={userGuild.wins} />
                                    <GuildStat label="MATCHES" value={userGuild.totalMatches} />
                                    <GuildStat label="WIN RATE" value={`${Math.round((userGuild.wins / userGuild.totalMatches) * 100)}%`} />
                                </View>
                            </Card>
                        </View>

                        {/* Members */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>MEMBERS</Text>
                            {userGuild.members.map(memberId => {
                                const member = mockUsers.find(u => u.id === memberId);
                                if (!member) return null;
                                return (
                                    <View key={member.id} style={styles.memberRow}>
                                        <Avatar size="sm" tier={member.tier} />
                                        <View style={styles.memberInfo}>
                                            <Text style={styles.memberName}>{member.username}</Text>
                                            <Text style={styles.memberRole}>
                                                {member.id === userGuild.leaderId ? '👑 Leader' : 'Member'}
                                            </Text>
                                        </View>
                                        <Badge text={member.tier.toUpperCase()} variant="tier" tier={member.tier} size="sm" />
                                    </View>
                                );
                            })}
                        </View>

                        {/* Guild Actions */}
                        <View style={styles.section}>
                            <Button title="GUILD VS GUILD" onPress={() => { }} fullWidth icon={<Ionicons name="shield-outline" size={18} color={Colors.background} />} />
                            <View style={{ height: Spacing.sm }} />
                            <Button title="INVITE MEMBERS" onPress={() => { }} fullWidth variant="outline" icon={<Ionicons name="person-add-outline" size={18} color={Colors.primary} />} />
                        </View>
                    </>
                ) : (
                    <View style={styles.noGuild}>
                        <Ionicons name="people-outline" size={72} color={Colors.textMuted} />
                        <Text style={styles.noGuildTitle}>No Guild Yet</Text>
                        <Text style={styles.noGuildText}>
                            Create or join a guild to compete in guild wars and climb the leaderboard!
                        </Text>
                        <View style={styles.noGuildActions}>
                            <Button title="CREATE GUILD" onPress={() => { }} fullWidth />
                            <Button title="BROWSE GUILDS" onPress={() => { }} fullWidth variant="outline" />
                        </View>
                    </View>
                )}

                {/* Guild Leaderboard */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🏆 GUILD LEADERBOARD</Text>
                    {mockGuilds.map((guild, i) => (
                        <View key={guild.id} style={styles.guildLeaderRow}>
                            <Text style={[styles.guildRank, i === 0 && { color: Colors.tierGold }]}>
                                #{i + 1}
                            </Text>
                            <View style={styles.guildLeaderAvatar}>
                                <Text style={styles.guildLeaderTag}>{guild.tag}</Text>
                            </View>
                            <View style={styles.guildLeaderInfo}>
                                <Text style={styles.guildLeaderName}>{guild.name}</Text>
                                <Text style={styles.guildLeaderMembers}>{guild.members.length} members</Text>
                            </View>
                            <Text style={styles.guildLeaderWins}>{guild.wins}W</Text>
                        </View>
                    ))}
                </View>

                <View style={{ height: 32 }} />
            </ScrollView>
        </GradientBackground>
    );
}

function GuildStat({ label, value }: { label: string; value: string | number }) {
    return (
        <View style={styles.gStat}>
            <Text style={styles.gStatValue}>{value}</Text>
            <Text style={styles.gStatLabel}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
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

    guildHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.base,
        marginBottom: Spacing.lg,
    },
    guildAvatar: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 245, 255, 0.12)',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    guildTag: {
        color: Colors.primary,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.extrabold,
        letterSpacing: 2,
    },
    guildInfo: {
        flex: 1,
        gap: Spacing.xs,
    },
    guildName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
    },
    guildStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    gStat: {
        alignItems: 'center',
    },
    gStatValue: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.extrabold,
    },
    gStatLabel: {
        color: Colors.textMuted,
        fontSize: 9,
        fontWeight: FontWeights.bold,
        letterSpacing: 0.5,
        marginTop: 2,
    },

    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: Spacing.md,
    },
    memberInfo: { flex: 1 },
    memberName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
    },
    memberRole: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
        marginTop: 2,
    },

    noGuild: {
        alignItems: 'center',
        paddingHorizontal: Spacing['2xl'],
        paddingVertical: Spacing['3xl'],
    },
    noGuildTitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    noGuildText: {
        color: Colors.textMuted,
        fontSize: FontSizes.md,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 22,
    },
    noGuildActions: {
        width: '100%',
        gap: Spacing.sm,
    },

    guildLeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        gap: Spacing.md,
    },
    guildRank: {
        color: Colors.textMuted,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.extrabold,
        width: 28,
    },
    guildLeaderAvatar: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    guildLeaderTag: {
        color: Colors.textPrimary,
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.bold,
    },
    guildLeaderInfo: { flex: 1 },
    guildLeaderName: {
        color: Colors.textPrimary,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.bold,
    },
    guildLeaderMembers: {
        color: Colors.textMuted,
        fontSize: FontSizes.xs,
    },
    guildLeaderWins: {
        color: Colors.success,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.extrabold,
    },
});
