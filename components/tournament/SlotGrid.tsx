import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { TournamentSlot } from '@/services/mockData';

interface SlotGridProps {
    slots: TournamentSlot[];
    type: 'solo' | 'duo' | 'squad';
    selectedId?: number;
    onSelect: (id: number) => void;
}

export function SlotGrid({ slots, type, selectedId, onSelect }: SlotGridProps) {
    // 4 columns for all types for consistency, or maybe 5?
    // 52 / 4 = 13 rows.
    // 26 / 3 = 8 rows?
    // Let's use flexWrap with a fixed width item.

    return (
        <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
            <View style={styles.grid}>
                {slots.map((slot) => {
                    const isSelected = selectedId === slot.id;
                    const isLocked = slot.status === 'locked' || slot.status === 'reserved';

                    return (
                        <TouchableOpacity
                            key={slot.id}
                            style={[
                                styles.slot,
                                isLocked && styles.slotLocked,
                                isSelected && styles.slotSelected,
                                // Adjust size for Squad (fewer slots, can be bigger)
                                type === 'squad' && styles.slotLarge
                            ]}
                            onPress={() => !isLocked && onSelect(slot.id)}
                            disabled={isLocked}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.slotNum,
                                isLocked && styles.textLocked,
                                isSelected && styles.textSelected
                            ]}>
                                {slot.id}
                            </Text>
                            <Text style={[
                                styles.slotLabel,
                                isLocked && styles.textLocked,
                                isSelected && styles.textSelected
                            ]}>
                                {isLocked ? (slot.userId ? 'Taken' : 'Team') : 'Open'}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: Spacing.sm,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        justifyContent: 'center', // Center the grid
    },
    slot: {
        width: 60, // Default for 52 slots ~ 5 per row on typical screen (360px / 5 = 72)
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slotLarge: {
        width: '30%', // 3 per row for Squad (13 slots)
        height: 80,
    },
    slotLocked: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)', // Red tint
        borderColor: Colors.danger,
        opacity: 0.7,
    },
    slotSelected: {
        backgroundColor: 'rgba(0, 245, 255, 0.2)', // Cyan tint
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    slotNum: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
    },
    slotLabel: {
        color: Colors.success,
        fontSize: 10,
        fontWeight: FontWeights.medium,
        marginTop: 2,
    },
    textLocked: {
        color: Colors.danger,
    },
    textSelected: {
        color: Colors.primary,
    },
});
