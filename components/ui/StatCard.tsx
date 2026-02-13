import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { FontWeights } from '@/constants/typography';
import { BorderRadius, Spacing, Shadows } from '@/constants/spacing';
import { TextStyles } from '@/constants/typography';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    accent?: boolean;
    style?: ViewStyle;
}

export function StatCard({ icon, label, value, accent = false, style }: StatCardProps) {
    return (
        <View style={[styles.container, accent && styles.accentContainer, style]}>
            <View style={[styles.iconCircle, accent && styles.accentIcon]}>
                {icon}
            </View>
            <Text style={[TextStyles.monoLg, styles.value, accent && { color: Colors.primary }]}>
                {value}
            </Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.base,
        alignItems: 'center',
        flex: 1,
    },
    accentContainer: {
        borderColor: Colors.borderAccent,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surfaceLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.sm,
    },
    accentIcon: {
        backgroundColor: 'rgba(0, 245, 255, 0.12)',
    },
    value: {
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    label: {
        color: Colors.textMuted,
        fontSize: 11,
        fontWeight: FontWeights.semibold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
