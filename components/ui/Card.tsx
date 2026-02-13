import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { BorderRadius, Spacing, Shadows } from '@/constants/spacing';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'neon' | 'elevated';
    style?: ViewStyle;
    padding?: number;
}

export function Card({ children, variant = 'default', style, padding }: CardProps) {
    const cardPadding = padding ?? Spacing.base;

    if (variant === 'neon') {
        return (
            <LinearGradient
                colors={[...Colors.gradientPrimary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.neonBorder, style]}
            >
                <View style={[styles.neonInner, { padding: cardPadding }]}>
                    {children}
                </View>
            </LinearGradient>
        );
    }

    return (
        <View
            style={[
                styles.base,
                variant === 'glass' && styles.glass,
                variant === 'elevated' && styles.elevated,
                { padding: cardPadding },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    base: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    glass: {
        backgroundColor: 'rgba(20, 26, 46, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    elevated: {
        backgroundColor: Colors.card,
        ...Shadows.md,
    },
    neonBorder: {
        borderRadius: BorderRadius.lg + 1,
        padding: 1.5,
    },
    neonInner: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
    },
});
