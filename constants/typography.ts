/**
 * BattleZone — Typography System
 * Aggressive, bold gamer typography
 */
import { Platform } from 'react-native';

const fontFamily = Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
    default: 'System',
});

const monoFamily = Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    web: "'JetBrains Mono', 'Fira Code', monospace",
    default: 'monospace',
});

export const FontSizes = {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
} as const;

export const FontWeights = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
    black: '900' as const,
};

export const TextStyles = {
    // ── Headers (Aggressive) ──
    h1: {
        fontFamily,
        fontSize: FontSizes['4xl'],
        fontWeight: FontWeights.black,
        letterSpacing: -0.5,
        lineHeight: 44,
    },
    h2: {
        fontFamily,
        fontSize: FontSizes['3xl'],
        fontWeight: FontWeights.extrabold,
        letterSpacing: -0.3,
        lineHeight: 38,
    },
    h3: {
        fontFamily,
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        letterSpacing: 0,
        lineHeight: 32,
    },
    h4: {
        fontFamily,
        fontSize: FontSizes.xl,
        fontWeight: FontWeights.bold,
        lineHeight: 28,
    },

    // ── Body ──
    body: {
        fontFamily,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.regular,
        lineHeight: 24,
    },
    bodyBold: {
        fontFamily,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.semibold,
        lineHeight: 24,
    },
    bodySm: {
        fontFamily,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.regular,
        lineHeight: 20,
    },

    // ── Labels ──
    label: {
        fontFamily,
        fontSize: FontSizes.sm,
        fontWeight: FontWeights.semibold,
        letterSpacing: 0.5,
        textTransform: 'uppercase' as const,
        lineHeight: 16,
    },
    labelLg: {
        fontFamily,
        fontSize: FontSizes.md,
        fontWeight: FontWeights.semibold,
        letterSpacing: 0.3,
        textTransform: 'uppercase' as const,
        lineHeight: 20,
    },

    // ── Captions ──
    caption: {
        fontFamily,
        fontSize: FontSizes.xs,
        fontWeight: FontWeights.medium,
        lineHeight: 14,
    },

    // ── Mono (stats, numbers) ──
    mono: {
        fontFamily: monoFamily,
        fontSize: FontSizes.base,
        fontWeight: FontWeights.bold,
        lineHeight: 22,
    },
    monoLg: {
        fontFamily: monoFamily,
        fontSize: FontSizes['2xl'],
        fontWeight: FontWeights.bold,
        lineHeight: 32,
    },
} as const;

export const Fonts = {
    regular: fontFamily,
    mono: monoFamily,
    rounded: fontFamily,
} as const;
