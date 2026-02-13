import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    ImageBackground,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { Tournament } from '@/services/mockData';
import { ScaleButton } from '@/components/ui/ScaleButton';
import { Badge } from '@/components/ui/Badge';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = 12;
const SIDE_INSET = (width - CARD_WIDTH) / 2;

interface HeroCarouselProps {
    tournaments: Tournament[];
    onPress: (id: string) => void;
}

export function HeroCarousel({ tournaments, onPress }: HeroCarouselProps) {
    const scrollX = useRef(new Animated.Value(0)).current;

    if (!tournaments.length) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>FEATURED & LIVE</Text>
            <Animated.FlatList
                data={tournaments}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                decelerationRate="fast"
                contentContainerStyle={[styles.contentContainer, { paddingHorizontal: SIDE_INSET }]}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                renderItem={({ item, index }) => {
                    const inputRange = [
                        (index - 1) * (CARD_WIDTH + SPACING),
                        index * (CARD_WIDTH + SPACING),
                        (index + 1) * (CARD_WIDTH + SPACING),
                    ];

                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.9, 1, 0.9],
                        extrapolate: 'clamp',
                    });

                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.7, 1, 0.7],
                        extrapolate: 'clamp',
                    });

                    return (
                        <Animated.View style={{ transform: [{ scale }], opacity }}>
                            <HeroCard tournament={item} onPress={onPress} />
                        </Animated.View>
                    );
                }}
            />
        </View>
    );
}

function HeroCard({ tournament, onPress }: { tournament: Tournament; onPress: (id: string) => void }) {
    // Determine gradient based on status
    const isLive = tournament.status === 'live';
    const gradientColors = isLive
        ? Colors.gradientBonfire // Fire for Live
        : Colors.gradientPrimary; // Gold for Upcoming

    return (
        <ScaleButton onPress={() => onPress(tournament.id)} style={styles.cardContainer}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
            >
                <View style={styles.cardContent}>
                    <View style={styles.topRow}>
                        <Badge
                            text={isLive ? 'LIVE NOW' : 'FEATURED'}
                            variant={isLive ? 'danger' : 'warning'}
                            size="sm"
                        />
                        <View style={styles.prizeBadge}>
                            <Ionicons name="trophy" size={14} color={Colors.tierGold} />
                            <Text style={styles.prizeText}>₹{tournament.prizePool}</Text>
                        </View>
                    </View>

                    <View style={styles.mainInfo}>
                        <Text style={styles.title} numberOfLines={2}>{tournament.title}</Text>
                        <Text style={styles.subtitle}>
                            {tournament.type.toUpperCase()} • {tournament.map}
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.slots}>
                            <Text style={styles.slotCount}>
                                {tournament.currentPlayers}/{tournament.maxPlayers}
                            </Text>
                            <Text style={styles.slotLabel}>Joined</Text>
                        </View>
                        <View style={styles.joinBtn}>
                            <Text style={styles.joinText}>JOIN NOW</Text>
                            <Ionicons name="arrow-forward" size={16} color={Colors.textPrimary} />
                        </View>
                    </View>
                </View>

                {/* Decorative Pattern Overlay */}
                <View style={styles.pattern} />
            </LinearGradient>
        </ScaleButton>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: Spacing.lg },
    headerTitle: {
        fontSize: FontSizes.sm, fontWeight: FontWeights.bold, color: Colors.textMuted,
        letterSpacing: 1.5, marginLeft: Spacing.base, marginBottom: Spacing.md,
    },
    contentContainer: { gap: SPACING, paddingBottom: Spacing.md },
    cardContainer: {
        width: CARD_WIDTH,
        height: 180,
        borderRadius: BorderRadius.xl,
        overflow: 'hidden',
        // Shadow for depth
        shadowColor: '#00F5FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    cardGradient: { flex: 1, padding: Spacing.lg },
    cardContent: { flex: 1, justifyContent: 'space-between', zIndex: 2 },

    topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    prizeBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12
    },
    prizeText: { color: Colors.tierGold, fontWeight: FontWeights.bold, fontSize: FontSizes.sm },

    mainInfo: { marginTop: Spacing.sm },
    title: {
        color: Colors.textPrimary, fontSize: FontSizes.xl, fontWeight: FontWeights.extrabold,
        letterSpacing: 0.5, lineHeight: 28
    },
    subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm, marginTop: 4, fontWeight: FontWeights.medium },

    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    slots: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
    slotCount: { color: Colors.textPrimary, fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
    slotLabel: { color: 'rgba(255,255,255,0.6)', fontSize: FontSizes.xs },

    joinBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full
    },
    joinText: { color: Colors.textPrimary, fontSize: FontSizes.xs, fontWeight: FontWeights.bold, letterSpacing: 1 },

    pattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.1,
        backgroundColor: 'transparent',
        // In a real app, use an ImageBackground with a grid/dot pattern here
        zIndex: 1,
    },
});
