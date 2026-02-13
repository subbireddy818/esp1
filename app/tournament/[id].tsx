import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Animated,
    ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius, Shadows } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Badge } from '@/components/ui/Badge';
import { TacticalCard } from '@/components/ui/TacticalCard';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { Button } from '@/components/ui/Button';
import { SlotGrid } from '@/components/tournament/SlotGrid';
import { TeamRegistrationModal, MemberInfo } from '@/components/tournament/TeamRegistrationModal';
import { PaymentModal } from '@/components/tournament/PaymentModal';
import { mockTournamentDetails, mockTournaments, TournamentSlot, TournamentDetail } from '@/services/mockData';
import { TournamentService } from '@/services/TournamentService';

type Tab = 'overview' | 'slots' | 'rules';

export default function TournamentDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    // State
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [teamModalVisible, setTeamModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [pendingTeamData, setPendingTeamData] = useState<{ name: string; members: MemberInfo[] } | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Toast State
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const toastOpacity = useRef(new Animated.Value(0)).current;

    const detailData = id ? mockTournamentDetails[id] : undefined;
    const tournament = detailData || mockTournaments.find(t => t.id === id);
    const detail: Partial<TournamentDetail> = detailData || {};

    // Animation for Header
    const scrollY = useRef(new Animated.Value(0)).current;
    const headerHeight = 250;
    const headerTranslate = scrollY.interpolate({
        inputRange: [0, headerHeight],
        outputRange: [0, -headerHeight / 1.5],
        extrapolate: 'clamp',
    });

    if (!tournament) {
        return (
            <GradientBackground>
                <View style={[styles.container, styles.centered]}>
                    <Text style={styles.errorText}>Tournament not found</Text>
                    <Button title="Go Back" onPress={() => router.back()} />
                </View>
            </GradientBackground>
        );
    }

    const startTime = new Date(tournament.startTime);
    const now = new Date();
    const msUntilStart = startTime.getTime() - now.getTime();
    const isLive = tournament.status === 'live';
    const isRegistered = detail?.registered?.includes('u1'); // Current user ID check

    // Methods
    const showToast = (message: string) => {
        setToastMessage(message);
        Animated.sequence([
            Animated.timing(toastOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(2000),
            Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]).start(() => setToastMessage(null));
    };

    const handleCopyRoomId = () => {
        // clipboard logic here
        showToast('Room ID Copied: ' + detail.roomId);
    };

    const handleJoinPress = () => {
        if (activeTab !== 'slots') setActiveTab('slots');
    };

    const handleSlotSelect = (slotId: number) => {
        setSelectedSlot(slotId);
        if (tournament.type === 'solo') {
            setPaymentModalVisible(true);
        } else {
            setTeamModalVisible(true);
        }
    };

    const handleTeamFormSubmit = (teamName: string, members: MemberInfo[]) => {
        setPendingTeamData({ name: teamName, members });
        setTeamModalVisible(false);
        setPaymentModalVisible(true);
    };

    const handlePaymentSuccess = async () => {
        let result;
        if (tournament.type === 'solo' && selectedSlot) {
            result = await TournamentService.registerSolo(tournament.id, selectedSlot);
        } else if (pendingTeamData && selectedSlot) {
            const memberUids = pendingTeamData.members.map(m => m.gameUid);
            result = await TournamentService.registerTeam(tournament.id, selectedSlot, pendingTeamData.name, memberUids);
        }

        setPaymentModalVisible(false);
        if (result?.success) {
            Alert.alert('Success', 'Registration successful! See you in the arena.', [{ text: 'OK' }]);
            setRefreshing(prev => !prev);
        } else {
            Alert.alert('Error', result?.message || 'Registration failed');
        }
    };

    return (
        <GradientBackground>
            <View style={{ flex: 1 }}>
                {/* Tactical Header Header */}
                <Animated.View style={[styles.headerBg, { transform: [{ translateY: headerTranslate }] }]}>
                    <LinearGradient
                        colors={['rgba(234, 179, 8, 0.1)', 'rgba(6, 182, 212, 0.05)', Colors.background]}
                        locations={[0, 0.5, 1]}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={styles.gridPattern} />
                    <View style={styles.headerContent}>
                        <Ionicons name="shield-half" size={120} color="rgba(234, 179, 8, 0.05)" style={styles.bgIcon} />
                        <View style={styles.scanLine} />
                    </View>
                </Animated.View>

                {/* Navbar */}
                <View style={styles.navbar}>
                    <ScaleButton onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                    <ScaleButton style={styles.shareBtn}>
                        <Ionicons name="share-social-outline" size={24} color={Colors.textPrimary} />
                    </ScaleButton>
                </View>

                <Animated.ScrollView
                    showsVerticalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    scrollEventThrottle={16}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Title Header */}
                    <View style={styles.titleContainer}>
                        <Badge
                            text={tournament.status.toUpperCase()}
                            variant={isLive ? 'success' : 'primary'}
                            style={{ marginBottom: Spacing.sm }}
                        />
                        <Text style={styles.tournamentTitle}>{tournament.title}</Text>
                        <View style={styles.metaRow}>
                            <Badge text={tournament.type.toUpperCase()} variant="info" />
                            <Text style={styles.mapText}>
                                <Ionicons name="map-outline" size={14} color={Colors.textMuted} /> {tournament.map}
                            </Text>
                            <Text style={styles.feeText}>
                                Fee: <Text style={{ color: Colors.success }}>{tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Room Details (If registered or Live) */}
                    {(isRegistered && detail.roomId) || isLive ? (
                        <TacticalCard style={styles.roomCard} variant="highlight" noPadding>
                            <View style={{ padding: Spacing.md }}>
                                <View style={styles.roomRow}>
                                    <View>
                                        <Text style={styles.roomLabel}>ROOM ID</Text>
                                        <Text style={styles.roomValue}>{detail.roomId || 'Wait for ID'}</Text>
                                    </View>
                                    <ScaleButton onPress={handleCopyRoomId} style={styles.copyBtn}>
                                        <Ionicons name="copy-outline" size={18} color={Colors.background} />
                                        <Text style={styles.copyText}>COPY</Text>
                                    </ScaleButton>
                                </View>
                                {detail.roomPassword && (
                                    <View style={{ marginTop: Spacing.md }}>
                                        <Text style={styles.roomLabel}>PASSWORD</Text>
                                        <Text style={styles.roomValue}>{detail.roomPassword}</Text>
                                    </View>
                                )}
                            </View>
                        </TacticalCard>
                    ) : null}

                    {/* Tabs */}
                    <View style={styles.tabContainer}>
                        {(['overview', 'slots', 'rules'] as Tab[]).map(t => (
                            <ScaleButton
                                key={t}
                                onPress={() => setActiveTab(t)}
                                style={[styles.tab, activeTab === t && styles.activeTab]}
                            >
                                <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>
                                    {t.toUpperCase()}
                                </Text>
                            </ScaleButton>
                        ))}
                    </View>

                    {/* Content */}
                    <View style={styles.contentSection}>
                        {activeTab === 'overview' && (
                            <View style={{ gap: Spacing.lg }}>
                                {/* Stats Row */}
                                <TacticalCard style={styles.statsRow} noPadding>
                                    <View style={{ flexDirection: 'row', paddingVertical: Spacing.lg }}>
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>₹{tournament.prizePool}</Text>
                                            <Text style={styles.statLabel}>Prize Pool</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>{tournament.maxPlayers}</Text>
                                            <Text style={styles.statLabel}>Slots</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.statItem}>
                                            <Text style={styles.statValue}>{detailsDate(tournament.startTime)}</Text>
                                            <Text style={styles.statLabel}>Start Time</Text>
                                        </View>
                                    </View>
                                </TacticalCard>

                                {/* Prizes */}
                                {detail?.prizes && (
                                    <View>
                                        <Text style={styles.sectionTitle}>PRIZES</Text>
                                        <TacticalCard>
                                            {detail.prizes.map((p, i) => (
                                                <View key={i} style={[styles.prizeRow, i < (detail.prizes?.length || 0) - 1 && styles.borderBottom]}>
                                                    <Text style={[styles.prizePlace, i === 0 && { color: Colors.tierGold }]}>{p.place}</Text>
                                                    <Text style={styles.prizeAmount}>₹{p.amount}</Text>
                                                </View>
                                            ))}
                                        </TacticalCard>
                                    </View>
                                )}
                            </View>
                        )}

                        {activeTab === 'slots' && (
                            <View>
                                <Text style={styles.sectionTitle}>Select a Slot</Text>
                                <SlotGrid
                                    slots={tournament.slots}
                                    onSelect={handleSlotSelect}
                                    type={tournament.type}
                                    selectedId={selectedSlot || undefined}
                                />
                            </View>
                        )}

                        {activeTab === 'rules' && (
                            <TacticalCard>
                                {detail?.rules?.map((rule, i) => (
                                    <View key={i} style={styles.ruleRow}>
                                        <Text style={styles.ruleBullet}>{i + 1}.</Text>
                                        <Text style={styles.ruleText}>{rule}</Text>
                                    </View>
                                ))}
                            </TacticalCard>
                        )}
                    </View>

                    <View style={{ height: 100 }} />
                </Animated.ScrollView>

                {/* Bottom Action Bar */}
                {!isRegistered && !isLive && activeTab !== 'slots' && (
                    <View style={styles.bottomBar}>
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.9)', Colors.background]}
                            style={StyleSheet.absoluteFill}
                        />
                        <Button
                            title="JOIN TOURNAMENT"
                            onPress={handleJoinPress}
                            fullWidth
                            size="lg"
                            variant="primary"
                        />
                    </View>
                )}

                {/* Modals */}
                <TeamRegistrationModal
                    visible={teamModalVisible}
                    onClose={() => setTeamModalVisible(false)}
                    onSubmit={handleTeamFormSubmit}
                    type={tournament.type === 'duo' ? 'duo' : 'squad'}
                />
                <PaymentModal
                    visible={paymentModalVisible}
                    onClose={() => setPaymentModalVisible(false)}
                    onSuccess={handlePaymentSuccess}
                    amount={tournament.entryFee}
                    tournamentTitle={tournament.title}
                    type={tournament.type}
                />

                {/* Custom Toast */}
                {toastMessage && (
                    <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
                        <Ionicons name="checkmark-circle" size={20} color={Colors.background} />
                        <Text style={styles.toastText}>{toastMessage}</Text>
                    </Animated.View>
                )}
            </View>
        </GradientBackground>
    );
}

function detailsDate(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    centered: { justifyContent: 'center', alignItems: 'center' },
    errorText: { color: Colors.textMuted, marginBottom: Spacing.md },

    headerBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 350, zIndex: 0, overflow: 'hidden' },
    gridPattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.05,
        backgroundColor: 'transparent',
        borderWidth: 0.5,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
    },
    headerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    bgIcon: { position: 'absolute', top: 60 },
    scanLine: {
        width: '100%',
        height: 2,
        backgroundColor: Colors.primaryGlow,
        position: 'absolute',
        top: '40%',
        opacity: 0.3,
    },

    navbar: {
        position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row',
        justifyContent: 'space-between', paddingHorizontal: Spacing.base, zIndex: 10
    },
    backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    shareBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },

    scrollContent: { paddingTop: 260, paddingHorizontal: Spacing.base },

    titleContainer: { marginBottom: Spacing.lg },
    tournamentTitle: { color: Colors.textPrimary, fontSize: 34, fontWeight: '900', letterSpacing: 1, fontFamily: 'monospace' },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: 12 },
    mapText: { color: Colors.accent, fontSize: FontSizes.sm, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 1 },
    feeText: { color: Colors.textPrimary, fontSize: FontSizes.sm, fontWeight: 'bold' },

    roomCard: { marginBottom: Spacing.lg, borderLeftWidth: 4, borderLeftColor: Colors.primary },
    roomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roomLabel: { color: Colors.textMuted, fontSize: 10, fontWeight: FontWeights.bold, letterSpacing: 1 },
    roomValue: { color: Colors.primary, fontSize: FontSizes.xl, fontWeight: FontWeights.extrabold, letterSpacing: 2 },
    copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: BorderRadius.full },
    copyText: { color: Colors.background, fontSize: 10, fontWeight: FontWeights.bold },

    tabContainer: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)', paddingBottom: Spacing.sm },
    tab: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
    activeTab: { borderBottomWidth: 2, borderBottomColor: Colors.primary, marginBottom: -2 },
    tabText: { color: Colors.textMuted, fontWeight: '900', fontSize: 11, fontFamily: 'monospace', letterSpacing: 1 },
    activeTabText: { color: Colors.primary },

    contentSection: {},
    sectionTitle: { color: Colors.textPrimary, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: Spacing.md, marginTop: Spacing.md, fontFamily: 'monospace', opacity: 0.6 },

    statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.lg, backgroundColor: 'rgba(255,255,255,0.02)' },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { color: Colors.textPrimary, fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
    statLabel: { color: Colors.textMuted, fontSize: 9, marginTop: 4, fontWeight: '900', letterSpacing: 1 },
    divider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' },

    prizeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm },
    borderBottom: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    prizePlace: { color: Colors.textSecondary, fontWeight: FontWeights.bold },
    prizeAmount: { color: Colors.success, fontWeight: FontWeights.bold },

    ruleRow: { flexDirection: 'row', marginBottom: Spacing.sm },
    ruleBullet: { color: Colors.primary, marginRight: Spacing.sm, fontWeight: 'bold' },
    ruleText: { color: Colors.textSecondary, flex: 1, fontSize: FontSizes.sm, lineHeight: 20 },

    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.lg, paddingBottom: 40 },

    toast: {
        position: 'absolute', bottom: 100, alignSelf: 'center',
        backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25,
        flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: Colors.primary, shadowOpacity: 0.5, shadowRadius: 10, elevation: 10
    },
    toastText: { color: Colors.background, fontWeight: FontWeights.bold },
});
