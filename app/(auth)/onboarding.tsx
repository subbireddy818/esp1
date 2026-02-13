import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { Button } from '@/components/ui/Button';

const { width, height } = Dimensions.get('window');

const slides = [
    {
        icon: 'game-controller' as const,
        title: 'BATTLE ZONE',
        subtitle: 'The Ultimate Esports Arena',
        description: 'Join tournaments, crush opponents, and win real prizes.',
        color: Colors.primary,
    },
    {
        icon: 'trophy' as const,
        title: 'COMPETE & WIN',
        subtitle: 'Solo • Duo • Squad',
        description: 'Enter tournaments with entry fees, climb leaderboards, and take home the prize pool.',
        color: Colors.warning,
    },
    {
        icon: 'people' as const,
        title: 'BUILD YOUR GUILD',
        subtitle: 'Rise Together',
        description: 'Create or join a guild. Compete in guild wars and dominate the rankings.',
        color: Colors.accent,
    },
];

export default function OnboardingScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (activeIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
            setActiveIndex(activeIndex + 1);
        } else {
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/login');
    };

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Skip */}
                <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                {/* Slides */}
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={false}
                    keyExtractor={(_, i) => String(i)}
                    renderItem={({ item }) => (
                        <View style={styles.slide}>
                            <View style={[styles.iconCircle, { borderColor: item.color }]}>
                                <Ionicons name={item.icon} size={64} color={item.color} />
                            </View>
                            <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
                            <Text style={styles.subtitle}>{item.subtitle}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    )}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / width);
                        setActiveIndex(index);
                    }}
                />

                {/* Dots */}
                <View style={styles.dotsRow}>
                    {slides.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.dot,
                                i === activeIndex && styles.dotActive,
                            ]}
                        />
                    ))}
                </View>

                {/* CTA */}
                <View style={styles.ctaSection}>
                    <Button
                        title={activeIndex === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
                        onPress={handleNext}
                        fullWidth
                        size="lg"
                    />
                </View>
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipBtn: {
        position: 'absolute',
        top: 56,
        right: Spacing.lg,
        zIndex: 10,
        padding: Spacing.sm,
    },
    skipText: {
        color: Colors.textMuted,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing['2xl'],
        paddingTop: height * 0.15,
    },
    iconCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        marginBottom: Spacing['2xl'],
    },
    title: {
        ...TextStyles.h1,
        textAlign: 'center',
        marginBottom: Spacing.sm,
        letterSpacing: 3,
    },
    subtitle: {
        color: Colors.textSecondary,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.semibold,
        textAlign: 'center',
        marginBottom: Spacing.base,
    },
    description: {
        color: Colors.textMuted,
        fontSize: FontSizes.base,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    dotsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing['2xl'],
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.surfaceLight,
    },
    dotActive: {
        width: 28,
        backgroundColor: Colors.primary,
    },
    ctaSection: {
        paddingHorizontal: Spacing['2xl'],
        paddingBottom: Spacing['3xl'],
    },
});
