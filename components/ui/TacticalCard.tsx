import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { BorderRadius } from '@/constants/spacing';

interface TacticalCardProps {
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    variant?: 'default' | 'highlight' | 'alert';
    noPadding?: boolean;
}

export function TacticalCard({ children, style, variant = 'default', noPadding }: TacticalCardProps) {
    const isHighlight = variant === 'highlight';
    const isAlert = variant === 'alert';

    const borderColor = isAlert ? Colors.danger : isHighlight ? Colors.primary : Colors.border;
    const bgColors = isHighlight
        ? ['rgba(234, 179, 8, 0.05)', 'rgba(234, 179, 8, 0.02)'] as const
        : isAlert
            ? ['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)'] as const
            : ['#18181B', '#121214'] as const;

    return (
        <View style={[styles.container, style]}>
            {/* HUD Corner Accents */}
            <View style={[styles.corner, styles.tl, { borderColor }]} />
            <View style={[styles.corner, styles.tr, { borderColor }]} />
            <View style={[styles.corner, styles.bl, { borderColor }]} />
            <View style={[styles.corner, styles.br, { borderColor }]} />

            {/* Main Surface */}
            <LinearGradient
                colors={bgColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.surface, noPadding && { padding: 0 }, { borderColor }]}
            >
                {/* Scanline Overlay */}
                <View style={styles.scanlines} pointerEvents="none" />
                {children}
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginVertical: 4,
    },
    surface: {
        borderRadius: 2, // Sharp corners
        borderWidth: 1,
        padding: 16,
        overflow: 'hidden',
    },
    scanlines: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        // In a real implementation we might use a repeating gradient for scanlines
        // For now just a subtle tint
    },
    corner: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderWidth: 2,
        zIndex: 10,
        borderColor: Colors.border,
    },
    tl: { top: -1, left: -1, borderRightWidth: 0, borderBottomWidth: 0 },
    tr: { top: -1, right: -1, borderLeftWidth: 0, borderBottomWidth: 0 },
    bl: { bottom: -1, left: -1, borderRightWidth: 0, borderTopWidth: 0 },
    br: { bottom: -1, right: -1, borderLeftWidth: 0, borderTopWidth: 0 },
});
