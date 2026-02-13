import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    message?: string;
    action?: React.ReactNode;
    style?: ViewStyle;
}

export function EmptyState({ icon = 'game-controller-outline', title, message, action, style }: EmptyStateProps) {
    return (
        <View style={[styles.container, style]}>
            <Ionicons name={icon} size={56} color={Colors.textMuted} />
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            {action && <View style={styles.action}>{action}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing['3xl'],
    },
    title: {
        color: Colors.textSecondary,
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        marginTop: Spacing.base,
        textAlign: 'center',
    },
    message: {
        color: Colors.textMuted,
        fontSize: FontSizes.md,
        marginTop: Spacing.sm,
        textAlign: 'center',
        lineHeight: 20,
    },
    action: {
        marginTop: Spacing.lg,
    },
});
