import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { Spacing } from '@/constants/spacing';

interface ScreenHeaderProps {
    title: string;
    subtitle?: string;
    rightAction?: React.ReactNode;
    leftAction?: React.ReactNode;
    style?: ViewStyle;
}

export function ScreenHeader({ title, subtitle, rightAction, leftAction, style }: ScreenHeaderProps) {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.leftSection}>
                {leftAction}
            </View>
            <View style={styles.centerSection}>
                <Text style={styles.title}>{title}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <View style={styles.rightSection}>
                {rightAction}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        minHeight: 56,
    },
    leftSection: {
        width: 40,
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
    },
    rightSection: {
        width: 40,
        alignItems: 'flex-end',
    },
    title: {
        color: Colors.textPrimary,
        fontSize: FontSizes.lg,
        fontWeight: FontWeights.bold,
        letterSpacing: 0.5,
    },
    subtitle: {
        color: Colors.textMuted,
        fontSize: FontSizes.sm,
        marginTop: 2,
    },
});
