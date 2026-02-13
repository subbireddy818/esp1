import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TournamentCard } from '@/components/ui/TournamentCard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { mockTournaments, mockLeaderboard, currentUser, mockNotifications } from '@/services/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const upcomingTournaments = mockTournaments.filter(t => t.status === 'upcoming').slice(0, 3);
  const liveTournaments = mockTournaments.filter(t => t.status === 'live');
  const nextMatch = upcomingTournaments[0];
  const unreadNotifs = mockNotifications.filter(n => !n.read).length;

  return (
    <GradientBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar size="md" tier={currentUser.tier} />
            <View>
              <Text style={styles.greeting}>COMMANDER // ACCESS LEVEL 5</Text>
              <Text style={styles.username}>{currentUser.username.toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications" size={20} color={Colors.primary} />
              {unreadNotifs > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadNotifs}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Featured Banner ── */}
        {nextMatch && (
          <TouchableOpacity
            onPress={() => router.push(`/tournament/${nextMatch.id}`)}
            activeOpacity={0.9}
            style={styles.bannerWrapper}
          >
            <LinearGradient
              colors={['rgba(234, 179, 8, 0.15)', 'rgba(6, 182, 212, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.gridOverlay} />
              <View style={styles.bannerContent}>
                <View style={styles.tagRow}>
                  <Badge text="PRIORITY DEPLOYMENT" variant="primary" size="sm" />
                  <View style={styles.livePulse} />
                </View>
                <Text style={styles.bannerTitle}>{nextMatch.title.toUpperCase()}</Text>
                <Text style={styles.bannerPrize}>POOL // ₹{nextMatch.prizePool}</Text>
                <View style={styles.timerRow}>
                  <Ionicons name="time-outline" size={14} color={Colors.primary} />
                  <Text style={styles.timerText}>EST. COMMENCEMENT: {new Date(nextMatch.startTime).toLocaleTimeString()}</Text>
                </View>
              </View>
              <View style={styles.bannerOverlay}>
                <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* ── Quick Actions ── */}
        <View style={styles.quickActions}>
          {(currentUser.role === 'creator' || currentUser.role === 'admin') && (
            <QuickAction icon="shield-checkmark" label="Ops" color={Colors.primary} onPress={() => router.push('/creator/dashboard')} />
          )}
          {currentUser.role === 'admin' && (
            <QuickAction icon="cog" label="Admin" color={Colors.accent} onPress={() => router.push('/admin/users')} />
          )}
          <QuickAction icon="flash" label="Quick Join" color={Colors.warning} onPress={() => router.push('/(tabs)/tournaments')} />
          <QuickAction icon="trophy" label="Leaderboard" color={Colors.accent} onPress={() => { }} />
          <QuickAction icon="wallet" label="Wallet" color={Colors.success} onPress={() => router.push('/(tabs)/wallet')} />
        </View>

        {/* ── Live Now ── */}
        {liveTournaments.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="🔴 LIVE NOW" />
            {liveTournaments.map(t => (
              <TournamentCard
                key={t.id}
                tournament={t}
                onPress={(id) => router.push(`/tournament/${id}`)}
                style={styles.cardSpacing}
              />
            ))}
          </View>
        )}

        {/* ── Upcoming Tournaments ── */}
        <View style={styles.section}>
          <SectionHeader
            title="⚡ UPCOMING"
            actionText="See All"
            onAction={() => router.push('/(tabs)/tournaments')}
          />
          {upcomingTournaments.map(t => (
            <TournamentCard
              key={t.id}
              tournament={t}
              onPress={(id) => router.push(`/tournament/${id}`)}
              style={styles.cardSpacing}
            />
          ))}
        </View>

        {/* ── Global Leaderboard Preview ── */}
        <View style={styles.section}>
          <SectionHeader title="🏆 TOP PLAYERS" />
          <Card variant="default">
            {mockLeaderboard.slice(0, 5).map((entry, i) => (
              <View key={entry.userId} style={[styles.leaderRow, i < 4 && styles.leaderRowBorder]}>
                <Text style={[styles.leaderRank, i < 3 && { color: i === 0 ? Colors.tierGold : i === 1 ? Colors.tierSilver : Colors.tierBronze }]}>
                  #{entry.rank}
                </Text>
                <Avatar size="sm" tier={entry.tier} />
                <View style={styles.leaderInfo}>
                  <Text style={styles.leaderName}>{entry.username}</Text>
                  <Text style={styles.leaderKills}>{entry.kills} kills</Text>
                </View>
                <Text style={styles.leaderPoints}>{entry.totalPoints} pts</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* ── Stats Summary ── */}
        <View style={styles.section}>
          <SectionHeader title="📊 YOUR STATS" />
          <View style={styles.statsGrid}>
            <StatBlock label="MATCHES" value={currentUser.stats.squad.matches + currentUser.stats.solo.matches} color={Colors.primary} />
            <StatBlock label="WINS" value={currentUser.stats.totalBooyahs} color={Colors.success} />
            <StatBlock label="KILLS" value={currentUser.stats.totalKills} color={Colors.danger} />
            <StatBlock label="ELO" value={currentUser.elo} color={Colors.accent} />
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </GradientBackground>
  );
}

// ── Sub-components ──

function SectionHeader({ title, actionText, onAction }: { title: string; actionText?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.seeAll}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function QuickAction({ icon, label, color, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; color: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.qaItem} activeOpacity={0.7}>
      <View style={[styles.qaIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.qaLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

function StatBlock({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.statBlock, { borderColor: `${color}33` }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  greeting: {
    color: Colors.accent,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  },
  username: {
    color: Colors.textPrimary,
    fontSize: FontSizes.lg,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  notifBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    width: 18,
    height: 18,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  notifBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },

  // Banner
  bannerWrapper: {
    marginHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  banner: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.2)',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  bannerContent: {
    flex: 1,
    gap: 8,
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  livePulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.danger },
  bannerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  bannerPrize: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  timerText: { color: Colors.textMuted, fontSize: 9, fontWeight: 'bold' },
  bannerOverlay: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(234,179,8,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.2)',
  },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  qaItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  qaIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaLabel: {
    color: Colors.textSecondary,
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  seeAll: {
    color: Colors.primary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
  },
  cardSpacing: {
    marginBottom: Spacing.md,
  },

  // Leaderboard
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  leaderRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leaderRank: {
    color: Colors.textMuted,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.extrabold,
    width: 32,
    textAlign: 'center',
  },
  leaderInfo: {
    flex: 1,
  },
  leaderName: {
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
  },
  leaderKills: {
    color: Colors.textMuted,
    fontSize: FontSizes.xs,
  },
  leaderPoints: {
    color: Colors.primary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.extrabold,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statBlock: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.base,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.extrabold,
    marginBottom: 2,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: FontWeights.bold,
    letterSpacing: 1,
  },
});
