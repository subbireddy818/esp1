import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights, TextStyles } from '@/constants/typography';
import { Spacing, BorderRadius } from '@/constants/spacing';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { TournamentCard } from '@/components/ui/TournamentCard';
import { HeroCarousel } from '@/components/tournament/HeroCarousel';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockTournaments, TournamentCategory, TournamentFormat } from '@/services/mockData';

export default function TournamentsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TournamentFormat>('solo');
    const [categoryFilter, setCategoryFilter] = useState<TournamentCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Featured Tournaments (Live or big prize pool)
    const featuredTournaments = mockTournaments.filter(t => t.status === 'live' || t.prizePool >= 5000);

    const filteredTournaments = mockTournaments.filter(t => {
        const matchesType = t.type === activeTab;
        const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesCategory && matchesSearch;
    });

    const handleTournamentPress = (id: string) => {
        router.push(`/tournament/${id}`);
    };

    const ListHeader = () => (
        <View style={styles.headerContainer}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search tournaments..."
                    placeholderTextColor={Colors.textMuted}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Hero Carousel */}
            {featuredTournaments.length > 0 && !searchQuery && (
                <HeroCarousel tournaments={featuredTournaments} onPress={handleTournamentPress} />
            )}

            {/* Filters Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ALL TOURNAMENTS</Text>
            </View>

            {/* Main Tabs: Solo / Duo / Squad */}
            <View style={styles.mainTabs}>
                {(['solo', 'duo', 'squad'] as TournamentFormat[]).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.mainTab, activeTab === tab && styles.mainTabActive]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.mainTabText, activeTab === tab && styles.mainTabTextActive]}>
                            {tab.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Filter Chips: Weekly / Monthly / Yearly */}
            <View style={styles.filterRow}>
                {(['all', 'weekly', 'monthly', 'yearly'] as const).map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterChip, categoryFilter === f && styles.filterChipActive]}
                        onPress={() => setCategoryFilter(f)}
                    >
                        <Text style={[styles.filterText, categoryFilter === f && styles.filterTextActive]}>
                            {f.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <GradientBackground>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.topHeader}>
                    <Text style={styles.headerTitle}>TOURNAMENTS</Text>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
                        <View style={styles.badge} />
                    </TouchableOpacity>
                </View>

                {/* Tournament List with Hero Header */}
                <FlatList
                    data={filteredTournaments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TournamentCard
                            tournament={item}
                            onPress={handleTournamentPress}
                            style={styles.cardContainer}
                        />
                    )}
                    ListHeaderComponent={ListHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <EmptyState
                            icon="trophy-outline"
                            title="No Tournaments Found"
                            message={`No ${activeTab} tournaments in ${categoryFilter === 'all' ? 'any' : categoryFilter} category.`}
                        />
                    }
                />
            </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 50 },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.md,
    },
    headerTitle: { ...TextStyles.h2, color: Colors.textPrimary, letterSpacing: 2 },
    iconBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    badge: {
        position: 'absolute', top: 10, right: 10, width: 8, height: 8,
        borderRadius: 4, backgroundColor: Colors.danger,
    },

    headerContainer: { marginBottom: Spacing.sm },

    searchContainer: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginHorizontal: Spacing.base,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        height: 48, marginBottom: Spacing.lg,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: { marginRight: Spacing.sm },
    searchInput: { flex: 1, color: Colors.textPrimary, fontSize: FontSizes.md },

    sectionHeader: { paddingHorizontal: Spacing.base, marginBottom: Spacing.sm },
    sectionTitle: {
        color: Colors.textMuted, fontSize: FontSizes.xs, fontWeight: FontWeights.bold, letterSpacing: 1.5
    },

    // Main Tabs (Solo / Duo / Squad)
    mainTabs: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.sm,
    },
    mainTab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    mainTabActive: { borderBottomColor: Colors.primary },
    mainTabText: { color: Colors.textMuted, fontWeight: FontWeights.bold, fontSize: FontSizes.md },
    mainTabTextActive: { color: Colors.primary },

    // Filter Chips (Weekly / Monthly / Yearly)
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.base,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    filterChip: {
        paddingVertical: 6, paddingHorizontal: 14,
        borderRadius: BorderRadius.full,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
    filterText: { color: Colors.textSecondary, fontWeight: FontWeights.semibold, fontSize: 11 },
    filterTextActive: { color: Colors.background },

    listContent: { paddingBottom: 80, gap: Spacing.md },
    cardContainer: { paddingHorizontal: Spacing.base, marginBottom: Spacing.sm },
});
