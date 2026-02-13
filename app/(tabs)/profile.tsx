import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    ImageBackground,
    Platform,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { currentUser, ModeStats } from '@/services/mockData';

type StatTab = 'solo' | 'duo' | 'squad';

export default function ProfileScreen() {
    const auth = useAuth();
    const [activeTab, setActiveTab] = useState<StatTab>('squad');
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [profileData, setProfileData] = useState({
        gameName: currentUser.gameName,
        bio: 'Esports enthusiast ready to dominate!' // Mock bio
    });

    const stats = currentUser.stats[activeTab];
    const scrollY = useRef(new Animated.Value(0)).current;

    const handleSaveProfile = (data: { gameName: string; bio: string }) => {
        setProfileData(data);
        // In real app, API call here
    };

    // Parallax Header Animations
    const headerHeight = 300;
    const headerTranslate = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight / 2],
        extrapolate: 'clamp',
    });
    const headerOpacity = scrollY.interpolate({
        inputRange: [0, headerHeight / 2],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <GradientBackground>
            <View style={{ flex: 1 }}>
                {/* Parallax Background (Fixed) */}
                <Animated.View style={[styles.parallaxHeader, { transform: [{ translateY: headerTranslate }], opacity: headerOpacity }]}>
                    <LinearGradient
                        colors={['rgba(0,245,255,0.1)', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />
                    {/* Decorative Circles */}
                    <View style={styles.decoCircle1} />
                    <View style={styles.decoCircle2} />
                </Animated.View>

                <Animated.ScrollView
                    style={styles.container}
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                    contentContainerStyle={{ paddingTop: 80, paddingBottom: 100 }}
                >
                    {/* Profile Header */}
                    <View style={styles.profileHeader}>
                        <ScaleButton activeOpacity={1}>
                            <View style={styles.avatarContainer}>
                                <Avatar size="xl" tier={currentUser.tier} />
                                <View style={styles.editIcon}>
                                    <Ionicons name="pencil" size={12} color={Colors.textPrimary} />
                                </View>
                            </View>
                        </ScaleButton>

                        <View style={styles.nameSection}>
                            <Text style={styles.username}>{currentUser.username}</Text>
                            {currentUser.seasonalTitles.length > 0 && (
                                <View style={styles.titleBadge}>
                                    <Ionicons name="ribbon" size={14} color={Colors.primary} />
                                    <Text style={styles.titleText}>{currentUser.seasonalTitles[0]}</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.bio}>{profileData.bio}</Text>

                        <View style={styles.tierRow}>
                            <Badge text={currentUser.tier.toUpperCase()} variant="tier" tier={currentUser.tier} size="md" />
                            <Text style={styles.elo}>ELO: {currentUser.elo}</Text>
                        </View>

                        <View style={styles.idsRow}>
                            <Text style={styles.uid}>UID: {currentUser.uid}</Text>
                            {profileData.gameName && (
                                <Text style={styles.gameName}> | IGN: {profileData.gameName}</Text>
                            )}
                        </View>
                    </View>

                    {/* Stat Tabs */}
                    <View style={styles.tabContainer}>
                        {(['solo', 'duo', 'squad'] as StatTab[]).map((tab) => (
                            <ScaleButton
                                key={tab}
                                style={[styles.tab, activeTab === tab && styles.activeTab]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                    {tab.toUpperCase()}
                                </Text>
                            </ScaleButton>
                        ))}
                    </View>

                    {/* Detailed Stats Grid - Tactical Cards */}
                    <View style={styles.section}>
                        <View style={styles.statsGrid}>
                            {/* KDA & Win Rate - Highlighted */}
                            <TacticalStatCard label="KDA RATIO" value={stats.kda.toFixed(2)} color={Colors.primary} large />
                            <TacticalStatCard label="WIN RATE" value={`${stats.winRate}%`} color={Colors.success} large />

                            {/* Core Stats */}
                            <TacticalStatCard label="MATCHES" value={stats.matches} color={Colors.textPrimary} />
                            <TacticalStatCard label="BOOYAHS" value={stats.booyahs} color={Colors.warning} pulse />
                            <TacticalStatCard label="KILLS" value={stats.kills} color={Colors.danger} />
                            <TacticalStatCard label="AVG SURVIVAL" value={stats.avgSurvivalTime} color={Colors.info} />
                            <TacticalStatCard label="TOP 10" value={stats.top10} color={Colors.tierDiamond} />
                            <TacticalStatCard label="HEADSHOT %" value={`${currentUser.stats.headshotRate}%`} color={Colors.accent} />
                        </View>
                    </View>

                    {/* ELO Progress */}
                    <View style={styles.section}>
                        <TacticalCard>
                            <View style={styles.eloSection}>
                                <Text style={styles.eloTitle}>SEASON RANK PROGRESS</Text>
                                <View style={styles.eloBar}>
                                    <LinearGradient
                                        colors={Colors.gradientPrimary}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.eloFill, { width: `${Math.min((currentUser.elo / 3500) * 100, 100)}%` }]}
                                    />
                                </View>
                                <View style={styles.eloLabels}>
                                    <Text style={styles.eloLabel}>BRONZE</Text>
                                    <Text style={styles.eloLabel}>PLATINUM</Text>
                                    <Text style={styles.eloLabel}>CONQUEROR</Text>
                                </View>
                            </View>
                        </TacticalCard>
                    </View>

                    {/* Achievements */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name="medal" size={16} color={Colors.primary} />
                                <Text style={styles.sectionTitle}>MEDALS & TITLES</Text>
                            </View>
                            <ScaleButton>
                                <Text style={styles.viewAll}>VIEW ALL</Text>
                            </ScaleButton>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsRow}>
                            <AchievementBadge label="MVP" icon="star" color={Colors.tierGold} unlocked count={currentUser.stats.mvpCount} />
                            <AchievementBadge label="Sharpshooter" icon="locate" color={Colors.danger} unlocked />
                            <AchievementBadge label="Survivor" icon="shield" color={Colors.success} unlocked />
                            <AchievementBadge label="Tactician" icon="map" color={Colors.info} unlocked={false} />
                        </ScrollView>
                    </View>

                    {/* Menu */}
                    <View style={styles.section}>
                        <TacticalCard noPadding>
                            <MenuItem icon="create-outline" label="EDIT PROFILE" onPress={() => setEditModalVisible(true)} />
                            <MenuItem
                                icon="settings-outline"
                                label="SETTINGS"
                                onPress={() => router.push('/settings')}
                            />
                            <MenuItem
                                icon="log-out-outline"
                                label="LOGOUT"
                                danger
                                last
                                onPress={() => {
                                    // Direct logout to bypass any alert issues
                                    auth.logout();
                                    router.replace('/(auth)/login');
                                }}
                            />
                        </TacticalCard>
                    </View>
                </Animated.ScrollView>
            </View>

            {/* Edit Modal */}
            <EditProfileModal
                visible={editModalVisible}
                onClose={() => setEditModalVisible(false)}
                onSave={handleSaveProfile}
            />
        </GradientBackground>
    );
}

function TacticalStatCard({ label, value, color, large, pulse }: { label: string; value: string | number; color: string; large?: boolean; pulse?: boolean }) {
    // Pulse animation logic for specific stats like Booyah
    const scaleAnim = useRef(new Animated.Value(1)).current;

    if (pulse) {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }

    return (
        <Animated.View style={[
            styles.statWrapper,
            large && styles.statWrapperLarge,
            { transform: [{ scale: scaleAnim }] }
        ]}>
            <TacticalCard style={styles.statInner} variant={large ? 'highlight' : 'default'} noPadding>
                <View style={styles.statContent}>
                    <Text style={[styles.pStatValue, large && { fontSize: 24 }, { color }]}>{value}</Text>
                    <Text style={styles.pStatLabel}>{label}</Text>
                </View>
            </TacticalCard>
        </Animated.View>
    );
}

function AchievementBadge({ label, icon, color, unlocked, count }: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; unlocked: boolean; count?: number }) {
    return (
        <ScaleButton style={[styles.achievement, !unlocked && styles.achievementLocked]}>
            <View style={[styles.achievementIcon, { backgroundColor: unlocked ? `${color}11` : 'rgba(255,255,255,0.02)', borderColor: unlocked ? color : 'transparent', borderWidth: 1 }]}>
                <Ionicons name={icon} size={20} color={unlocked ? color : Colors.textMuted} />
            </View>
            <Text style={[styles.achievementLabel, !unlocked && { color: Colors.textMuted }]}>{label}</Text>
            {count && count > 0 && (
                <View style={styles.countBadge}>
                    <Text style={styles.countText}>{count}</Text>
                </View>
            )}
        </ScaleButton>
    );
}

function MenuItem({ icon, label, badge, danger, onPress, last }: { icon: keyof typeof Ionicons.glyphMap; label: string; badge?: string; danger?: boolean; onPress?: () => void; last?: boolean }) {
    return (
        <ScaleButton style={[styles.menuItem, last && { borderBottomWidth: 0 }]} onPress={onPress}>
            <View style={[styles.menuIconBox, { backgroundColor: danger ? 'rgba(239,68,68,0.1)' : 'transparent' }]}>
                <Ionicons name={icon} size={18} color={danger ? Colors.danger : Colors.textSecondary} />
            </View>
            <Text style={[styles.menuLabel, danger && { color: Colors.danger }]}>{label}</Text>
            {badge && (
                <Badge text={badge} variant={badge === 'Verified' ? 'success' : 'warning'} size="sm" />
            )}
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 'auto' }} />
        </ScaleButton>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    parallaxHeader: { position: 'absolute', top: 0, left: 0, right: 0, height: 300, zIndex: 0 },
    decoCircle1: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(234,179,8,0.03)' }, // Gold tint
    decoCircle2: { position: 'absolute', top: 100, left: -50, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(6,182,212,0.03)' }, // Cyan tint

    profileHeader: { alignItems: 'center', paddingHorizontal: Spacing.base, marginBottom: Spacing.xl },
    avatarContainer: { position: 'relative' },
    editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.surfaceLight, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },

    nameSection: { alignItems: 'center', marginTop: Spacing.base, marginBottom: Spacing.xs },
    username: { ...TextStyles.h2, color: Colors.textPrimary, fontFamily: 'monospace' },
    titleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(234,179,8,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 2, marginTop: 4, borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)' },
    titleText: { color: Colors.primary, fontSize: 10, fontWeight: FontWeights.bold },

    bio: { color: Colors.textSecondary, fontSize: FontSizes.sm, textAlign: 'center', marginVertical: Spacing.sm, paddingHorizontal: Spacing.xl },

    tierRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginVertical: Spacing.sm },
    elo: { color: Colors.textSecondary, fontSize: FontSizes.md, fontWeight: FontWeights.bold, fontFamily: 'monospace' },
    idsRow: { flexDirection: 'row', gap: 4, opacity: 0.7 },
    uid: { color: Colors.textMuted, fontSize: FontSizes.sm, fontFamily: 'monospace' },
    gameName: { color: Colors.primary, fontSize: FontSizes.sm, fontWeight: FontWeights.bold },

    tabContainer: { flexDirection: 'row', paddingHorizontal: Spacing.base, marginBottom: Spacing.lg, gap: Spacing.md, justifyContent: 'center' },
    tab: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 1, borderColor: Colors.border },
    activeTab: { backgroundColor: 'rgba(234,179,8,0.1)', borderColor: Colors.primary },
    tabText: { color: Colors.textSecondary, fontWeight: FontWeights.bold, fontSize: FontSizes.sm },
    activeTabText: { color: Colors.primary },

    section: { paddingHorizontal: Spacing.base, marginBottom: Spacing.lg },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },

    statWrapper: { width: '31%', height: 80 },
    statWrapperLarge: { width: '48%', height: 90 },
    statInner: { height: '100%' },
    statContent: { alignItems: 'center', justifyContent: 'center', height: '100%' },

    pStatValue: { fontSize: FontSizes.xl, fontWeight: FontWeights.extrabold, marginBottom: 2, fontFamily: 'monospace' },
    pStatLabel: { color: Colors.textMuted, fontSize: 9, fontWeight: FontWeights.bold, letterSpacing: 1 },

    eloSection: { gap: Spacing.sm },
    eloTitle: { color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: FontWeights.bold, letterSpacing: 1.5 },
    eloBar: { height: 6, backgroundColor: Colors.surface, borderRadius: 2, overflow: 'hidden' },
    eloFill: { height: '100%', borderRadius: 2 },
    eloLabels: { flexDirection: 'row', justifyContent: 'space-between' },
    eloLabel: { color: Colors.textMuted, fontSize: 8, fontWeight: FontWeights.semibold },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    sectionTitle: { color: Colors.textPrimary, fontSize: FontSizes.sm, fontWeight: FontWeights.bold, letterSpacing: 1.5 },
    viewAll: { color: Colors.primary, fontSize: FontSizes.sm, fontFamily: 'monospace' },
    achievementsRow: { flexDirection: 'row' },
    achievement: { alignItems: 'center', marginRight: Spacing.base, width: 72 },
    achievementLocked: { opacity: 0.5 },
    achievementIcon: { width: 48, height: 48, borderRadius: 2, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xs },
    achievementLabel: { color: Colors.textSecondary, fontSize: 9, fontWeight: FontWeights.semibold, textAlign: 'center' },
    countBadge: { position: 'absolute', top: -4, right: 8, backgroundColor: Colors.primary, borderRadius: 2, minWidth: 14, height: 14, alignItems: 'center', justifyContent: 'center' },
    countText: { color: Colors.background, fontSize: 8, fontWeight: FontWeights.bold },

    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, gap: Spacing.md },
    menuIconBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
    menuLabel: { color: Colors.textPrimary, fontSize: FontSizes.sm, fontWeight: FontWeights.bold, flex: 1, letterSpacing: 0.5 },
});
