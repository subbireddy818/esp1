import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { FontSizes, FontWeights } from '@/constants/typography';
import { BorderRadius, Spacing } from '@/constants/spacing';

type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'info' | 'tier';
type TierLevel = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'conqueror';

interface BadgeProps {
    text: string;
    variant?: BadgeVariant;
    tier?: TierLevel;
    size?: 'sm' | 'md';
    icon?: React.ReactNode;
    style?: ViewStyle;
}

const tierColors: Record<TierLevel, string> = {
    bronze: Colors.tierBronze,
    silver: Colors.tierSilver,
    gold: Colors.tierGold,
    platinum: Colors.tierPlatinum,
    diamond: Colors.tierDiamond,
    conqueror: Colors.tierConqueror,
};

const variantColors: Record<string, { bg: string; text: string }> = {
    primary: { bg: 'rgba(0, 245, 255, 0.15)', text: Colors.primary },
    success: { bg: 'rgba(0, 255, 136, 0.15)', text: Colors.success },
    danger: { bg: 'rgba(255, 59, 92, 0.15)', text: Colors.danger },
    warning: { bg: 'rgba(255, 184, 0, 0.15)', text: Colors.warning },
    info: { bg: 'rgba(59, 130, 246, 0.15)', text: Colors.info },
};

export function Badge({ text, variant = 'primary', tier, size = 'sm', icon, style }: BadgeProps) {
    const isTier = variant === 'tier' && tier;
    const color = isTier ? tierColors[tier!] : variantColors[variant].text;
    const bgColor = isTier
        ? `${color}22`
        : variantColors[variant].bg;

    return (
        <View
            style={[
                styles.base,
                size === 'md' && styles.md,
                { backgroundColor: bgColor, borderColor: `${color}44` },
                style,
            ]}
        >
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text
                style={[
                    styles.text,
                    size === 'md' && styles.textMd,
                    { color },
                ]}
            >
                {text}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    md: {
        paddingHorizontal: Spacing.md,
        paddingVertical: 5,
    },
    icon: {
        marginRight: 4,
    },
    text: {
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.bold,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    textMd: {
        fontSize: FontSizes.sm,
    },
});
